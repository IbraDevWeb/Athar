// Vérification isolée du zoom et du déplacement horizontal d'Athar.
// Ne dépend ni des fiches de cours ni des autres parcours du test E2E global.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base=(process.env.ATHAR_E2E_BASE || 'http://127.0.0.1:4173').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});

async function verifyZoom(label,options){
    const page=await browser.newPage(options);
    try{
        await page.goto(base+'/index.html?zoom-regression='+label,{waitUntil:'domcontentloaded',timeout:90000});
        await page.waitForFunction(()=>{
            const main=document.querySelector('.athar-global-mainframe > main');
            return main&&window.AtharMobile&&getComputedStyle(main).overflowX==='auto';
        },null,{timeout:60000});

        const devtools=await page.context().newCDPSession(page);
        await devtools.send('Emulation.setPageScaleFactor',{pageScaleFactor:2});
        await page.waitForFunction(()=>window.visualViewport?.scale>=1.9,null,{timeout:10000});
        await page.waitForFunction(()=>{
            const value=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--athar-viewport-height'));
            return Number.isFinite(value)&&Math.abs(value-window.innerHeight)<=2;
        },null,{timeout:10000});

        const geometry=await page.evaluate(()=>{
            const main=document.querySelector('.athar-global-mainframe > main');
            return {
                layout:window.innerHeight,
                visual:window.visualViewport.height,
                app:document.getElementById('app').getBoundingClientRect().height,
                overflow:getComputedStyle(main).overflowX,
                keyboard:document.documentElement.classList.contains('athar-keyboard-open')
            };
        });
        assert.ok(geometry.visual<geometry.layout*.7,'Zoom ×2 inactif : '+JSON.stringify(geometry));
        assert.ok(Math.abs(geometry.app-geometry.layout)<=3,'Bande vide sous le contenu : '+JSON.stringify(geometry));
        assert.equal(geometry.overflow,'auto','Défilement horizontal masqué');
        assert.equal(geometry.keyboard,false,'Le zoom est traité à tort comme un clavier ouvert');

        if(options.hasTouch){
            await page.evaluate(()=>{
                const main=document.querySelector('.athar-global-mainframe > main');
                const probe=document.createElement('div');
                probe.id='zoom-pan-probe';
                probe.style.cssText='width:160vw;height:140px;pointer-events:auto;';
                main.prepend(probe);
                main.scrollTop=0;
                main.scrollLeft=0;
            });
            const x=Math.min(170,Math.round(options.viewport.width/2)-20);
            await devtools.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y:135,id:0}]});
            for(const delta of [12,24,36,48,60,72,84,96]){
                await devtools.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-delta,y:135,id:0}]});
                await page.waitForTimeout(18);
            }
            await devtools.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
            await page.waitForTimeout(100);
            const pan=await page.evaluate(()=>{
                const main=document.querySelector('.athar-global-mainframe > main');
                const probe=document.getElementById('zoom-pan-probe');
                return {
                    mainLeft:main.scrollLeft,
                    visualLeft:window.visualViewport?.offsetLeft || 0,
                    scrollRange:main.scrollWidth-main.clientWidth,
                    atPoint:document.elementFromPoint(130,135)?.tagName || '',
                    probeWidth:probe?.getBoundingClientRect().width || 0
                };
            });
            console.log('ZOOM/PAN DIAGNOSTIC : '+label+' '+JSON.stringify(pan));
            assert.ok(pan.mainLeft>10 || pan.visualLeft>10,'Impossible de balayer la page horizontalement sous zoom : '+JSON.stringify(pan));
            await page.evaluate(()=>{
                document.getElementById('zoom-pan-probe')?.remove();
                const main=document.querySelector('.athar-global-mainframe > main');
                main.scrollLeft=0;
                main.scrollTop=0;
            });
        }
        await devtools.send('Emulation.setPageScaleFactor',{pageScaleFactor:1});
        await page.waitForFunction(()=>window.visualViewport?.scale<=1.01,null,{timeout:10000});
        console.log('ZOOM/PAN PASS : '+label+' — hauteur '+geometry.layout+'px, zoom ×2, défilement horizontal autorisé');
    } finally{
        await page.close();
    }
}

try{
    await verifyZoom('desktop',{viewport:{width:1280,height:820}});
    await verifyZoom('mobile',{viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    await verifyZoom('mobile-etroit',{viewport:{width:360,height:740},isMobile:true,hasTouch:true});
} finally{
    await browser.close();
}
