from __future__ import annotations

import argparse
import json
from pathlib import Path

TOPICS = {
"prayer":(["prayer"],[["صلاة","الصلاة","يصلي","صلى"]],["la prière","la salat","la prière rituelle"]),
"recitation-aloud":(["prayer","recitation_aloud"],[["جهر","يجهر","جهرا","جهرية"],["صلاة","الصلاة"]],["la récitation à voix haute pendant la prière","le jahr dans la salat","la prière à voix haute"]),
"recitation-silent":(["prayer","recitation_silent"],[["إسرار","سرا","سرية","يخافت"],["صلاة","الصلاة"]],["la récitation à voix basse pendant la prière","la prière silencieuse","la récitation sirriyya"]),
"recitation":(["recitation"],[["قراءة","القراءة","يقرأ","قرأ"]],["la récitation du Coran","la lecture du Coran","la qiraa"]),
"fatiha":(["fatiha"],[["الفاتحة","فاتحة الكتاب"]],["la Fatiha","la sourate al-Fatiha","Fatihat al-Kitab"]),
"basmala":(["basmala"],[["البسملة","بسملة","بسم الله الرحمن الرحيم"]],["la basmala","Bismillah ar-Rahman ar-Rahim","la formule de la basmala"]),
"witr":(["witr"],[["وتر","الوتر","أوتر","يوتر"]],["le witr","la prière du witr","salat al-witr"]),
"qunut":(["qunut"],[["قنوت","القنوت","قنت","يقنت"]],["le qunut","le qounout","le kunut"]),
"ruku":(["ruku"],[["ركوع","الركوع","ركع","يركع"]],["le ruku","l'inclinaison dans la prière","le roukou"]),
"sujud":(["sujud"],[["سجود","السجود","سجد","يسجد"]],["le sujud","la prosternation","le soujoud"]),
"tashahhud":(["tashahhud"],[["تشهد","التشهد","التحيات"]],["le tashahhud","le tachahoud","les attahiyat"]),
"takbir":(["takbir"],[["تكبير","التكبير","كبر","الله أكبر"]],["le takbir","Allahu Akbar dans la prière","les takbirat"]),
"taslim":(["taslim"],[["تسليم","التسليم","السلام عليكم"]],["le taslim final","la salutation finale de la prière","le salam qui termine la salat"]),
"adhan":(["adhan"],[["أذان","الاذان","المؤذن","يؤذن"]],["l'adhan","l'appel à la prière","le muezzin et l'adhan"]),
"iqama":(["iqama"],[["إقامة","الاقامة","أقام الصلاة"]],["l'iqama","l'iqamah avant la prière","l'établissement de la prière"]),
"congregation":(["congregation"],[["جماعة","الجماعة","صلاة الجماعة"]],["la prière en groupe","la salat en congrégation","la jama'a pour la prière"]),
"imam":(["imam"],[["إمام","الامام","ائتم","المأموم"]],["l'imam dans la prière","le fidèle derrière l'imam","l'imam et le ma'mum"]),
"friday-prayer":(["friday_prayer","prayer"],[["جمعة","الجمعة","صلاة الجمعة"]],["la prière du vendredi","la jumu'a","Salat al-Jumu'a"]),
"prayer-times":(["prayer_times","prayer"],[["وقت الصلاة","اوقات الصلاة","مواقيت الصلاة","الوقت"]],["les heures de prière","les temps de la salat","les horaires des prières"]),
"fajr":(["fajr"],[["فجر","الفجر","صبح","الصبح"]],["la prière du fajr","la prière du sobh","la salat de l'aube"]),
"dhuhr":(["dhuhr"],[["ظهر","الظهر"]],["la prière du dhuhr","la prière de dohr","salat az-zuhr"]),
"asr":(["asr"],[["عصر","العصر"]],["la prière du asr","salat al-asr","la prière de l'après-midi, asr"]),
"maghrib":(["maghrib"],[["مغرب","المغرب"]],["la prière du maghrib","salat al-maghrib","la prière du coucher du soleil, maghrib"]),
"isha":(["isha"],[["عشاء","العشاء"]],["la prière de isha","la prière ichaa","salat al-isha"]),
"travel":(["travel"],[["سفر","السفر","مسافر","المسافر"]],["le voyageur","le safar","le voyage"]),
"combine-prayers":(["combine_prayers","travel","prayer"],[["جمع الصلاتين","يجمع","جمع بين","الجمع بين الصلاتين"],["سفر","السفر","مسافر"]],["le regroupement des prières en voyage","le jam des salat en safar","regrouper les prières en voyage"]),
"shorten-prayer":(["shorten_prayer","travel"],[["قصر الصلاة","القصر","يقصر","صلاة السفر"],["سفر","السفر","مسافر"]],["le qasr pendant le safar","la prière raccourcie du voyageur","raccourcir la prière en voyage"]),
"purification":(["purification"],[["طهارة","الطهارة","طهور"]],["la purification rituelle","la tahara","la pureté rituelle"]),
"wudu":(["wudu"],[["وضوء","الوضوء","توضأ","يتوضأ"]],["les ablutions","le wudu","les petites ablutions"]),
"ghusl":(["ghusl"],[["غسل","الغسل","اغتسل","يغتسل"]],["le ghusl","la grande ablution","le bain rituel"]),
"tayammum":(["tayammum"],[["تيمم","التيمم"]],["le tayammum","l'ablution sèche","le tayamum"]),
"menstruation":(["menstruation"],[["حيض","الحيض","حائض"]],["les menstrues","le hayd","la menstruation"]),
"fasting":(["fasting"],[["صيام","الصيام","صوم","الصوم","يفطر","فطر"]],["le jeûne","le siyam","le sawm"]),
"zakat":(["zakat"],[["زكاة","الزكاة","صدقة"]],["la zakat","l'aumône obligatoire","la zakât"]),
"marriage":(["marriage"],[["نكاح","النكاح","تزوج","زوج"]],["le mariage","le nikah","le mariage islamique"]),
"divorce":(["divorce"],[["طلاق","الطلاق","طلق"]],["le divorce","le talaq","la répudiation"]),
"inheritance":(["inheritance"],[["ميراث","الميراث","فرائض","الفرائض","وارث"]],["l'héritage","les héritiers et les faraid","la succession"]),
"riba":(["riba"],[["ربا","الربا"]],["le riba","l'usure","l'intérêt usuraire"]),
"badr":(["badr"],[["بدر","غزوة بدر","يوم بدر"]],["Badr","la bataille de Badr","Yawm Badr"]),
"ayat-kursi":(["ayat_al_kursi"],[["آية الكرسي","اية الكرسي","الكرسي","الله لا إله إلا هو الحي القيوم"]],["Ayat al-Kursi","le verset du Trône","l'Ayat al-Kursi"]),
"eclipse-prayer":(["eclipse_prayer"],[["صلاة الكسوف","الكسوف","كسوف","صلاة الخسوف","الخسوف","خسوف"]],["la prière de l'éclipse","salat al-kusuf","la prière lors d'une éclipse"]),
}

AR = [
("ar-prayer","ما الذي تقوله المصادر عن الصلاة؟","prayer"),("ar-fatiha","ماذا تقول المصادر عن الفاتحة؟","fatiha"),
("ar-witr","ما الذي ورد في المصادر عن الوتر؟","witr"),("ar-qunut","ماذا ورد في الكتب عن القنوت؟","qunut"),
("ar-sujud","ما الذي تقوله المصادر عن السجود؟","sujud"),("ar-adhan","ماذا ورد في الكتب عن الأذان؟","adhan"),
("ar-jumua","ماذا تقول المصادر عن صلاة الجمعة؟","friday-prayer"),("ar-travel","ما الذي تقوله كتب الفقه عن السفر والمسافر؟","travel"),
("ar-combine","ما حكم جمع الصلاتين في السفر في المصادر؟","combine-prayers"),("ar-qasr","ماذا تقول المصادر عن قصر الصلاة في السفر؟","shorten-prayer"),
("ar-wudu","ما الذي ورد في الكتب عن الوضوء؟","wudu"),("ar-ghusl","ماذا تقول المصادر عن الغسل؟","ghusl"),
("ar-tayammum","ما الذي ورد في الكتب عن التيمم؟","tayammum"),("ar-fasting","ماذا تقول المصادر عن الصيام؟","fasting"),
("ar-zakat","ما الذي ورد في الكتب عن الزكاة؟","zakat"),("ar-marriage","ماذا تقول كتب الفقه عن النكاح؟","marriage"),
("ar-divorce","ما الذي ورد في الكتب عن الطلاق؟","divorce"),("ar-inheritance","ماذا تقول المصادر عن الميراث والفرائض؟","inheritance"),
("ar-riba","ما الذي ورد في الكتب عن الربا؟","riba"),("ar-badr","ماذا تقول المصادر عن غزوة بدر؟","badr"),
]

MIX = [
("mix-salat-jahr","Que disent les textes sur le jahr dans la salat ?","recitation-aloud"),
("mix-salat-sirr","Que disent les textes sur la récitation sirriyya ?","recitation-silent"),
("mix-qiraa","Que disent les ouvrages sur la qiraa du Quran ?","recitation"),("mix-witr","Que disent les sources sur salat al-witr ?","witr"),
("mix-qunut","Que disent les textes sur le qunut dans la salat ?","qunut"),("mix-ruku","Que trouve-t-on sur le ruku dans la prière ?","ruku"),
("mix-sujud","Que trouve-t-on sur le sujud dans la prière ?","sujud"),("mix-tashahhud","Que disent les sources sur le tashahhud ?","tashahhud"),
("mix-adhan","Que disent les ouvrages sur adhan et iqama ?","adhan"),("mix-jumua","Que disent les sources sur salat al-jumua ?","friday-prayer"),
("mix-safar","Que disent les ouvrages sur le safar ?","travel"),("mix-jam-safar","Peut-on faire jam salat en safar ?","combine-prayers"),
("mix-qasr-safar","Peut-on faire qasr en safar ?","shorten-prayer"),("mix-wudu","Que disent les livres sur le wudu ?","wudu"),
("mix-ghusl","Que disent les livres sur le ghusl ?","ghusl"),("mix-siyam","Que disent les ouvrages sur le siyam ?","fasting"),
("mix-nikah","Que disent les ouvrages sur le nikah ?","marriage"),
]

ROUTES = [
("route-bukhari-intention","Que dit Sahih al-Bukhari sur les intentions ?","bukhari","openiti-sahih-bukhari",["intention"],[["نية","النية","نيات","بالنيات"]]),
("route-bukhari-prayer","Que rapporte Sahih al-Bukhari sur la prière ?","bukhari","openiti-sahih-bukhari",["prayer"],TOPICS["prayer"][1]),
("route-muslim-purification","Que dit Sahih Muslim sur la purification ?","muslim","openiti-sahih-muslim",["purification"],TOPICS["purification"][1]),
("route-muslim-prayer","Que rapporte Sahih Muslim sur la prière ?","muslim","openiti-sahih-muslim",["prayer"],TOPICS["prayer"][1]),
("route-tabari-fatiha","Que dit le Tafsir al-Tabari sur la sourate al-Fatiha ?","tabari","openiti-tabari-tafsir",["fatiha"],TOPICS["fatiha"][1]),
("route-tabari-kursi","Que dit le Tafsir al-Tabari sur Ayat al-Kursi ?","tabari","openiti-tabari-tafsir",["ayat_al_kursi"],TOPICS["ayat-kursi"][1]),
("route-ibn-kathir-fatiha","Que dit le Tafsir Ibn Kathir sur la Fatiha ?","ibn kathir","openiti-ibn-kathir-tafsir",["fatiha"],TOPICS["fatiha"][1]),
("route-ibn-kathir-kursi","Que dit le Tafsir Ibn Kathir sur Ayat al-Kursi ?","ibn kathir","openiti-ibn-kathir-tafsir",["ayat_al_kursi"],TOPICS["ayat-kursi"][1]),
("route-ibn-hisham-badr","Que trouve-t-on dans la Sira d'Ibn Hisham concernant Badr ?","ibn hisham","openiti-sira-ibn-hisham",["badr"],TOPICS["badr"][1]),
("route-ibn-hisham-sira","Que raconte la Sira d'Ibn Hisham au sujet de Badr ?","ibn hisham","openiti-sira-ibn-hisham",["badr"],TOPICS["badr"][1]),
("route-tirmidhi-witr","Que rapporte Sunan al-Tirmidhi sur le witr ?","tirmidhi","openiti-sunan-tirmidhi",["witr"],TOPICS["witr"][1]),
("route-tirmidhi-prayer","Que rapporte Sunan al-Tirmidhi sur la prière ?","tirmidhi","openiti-sunan-tirmidhi",["prayer"],TOPICS["prayer"][1]),
("route-muwatta-prayer","Que rapporte le Muwatta de Malik sur la prière ?","malik","kutub-28107",["prayer"],TOPICS["prayer"][1]),
("route-muwatta-adhan","Que rapporte le Muwatta de Malik sur l'adhan ?","malik","kutub-28107",["adhan"],TOPICS["adhan"][1]),
("route-bidayat-travel","Que dit Bidayat al-Mujtahid d'Ibn Rushd sur le voyageur ?","ibn rushd","kutub-21739",["travel"],TOPICS["travel"][1]),
("route-bidayat-combine","Que dit Bidayat al-Mujtahid d'Ibn Rushd sur le regroupement des prières en voyage ?","ibn rushd","kutub-21739",["combine_prayers","travel","prayer"],TOPICS["combine-prayers"][1]),
("route-abudawud-wudu","Que rapporte Sunan Abu Dawud sur le wudu ?","abu dawud","openiti-sunan-abu-dawud",["wudu"],TOPICS["wudu"][1]),
("route-abudawud-witr","Que rapporte Sunan Abu Dawud sur le witr ?","abu dawud","openiti-sunan-abu-dawud",["witr"],TOPICS["witr"][1]),
("route-nasai-prayer","Que rapporte Sunan al-Nasai sur la prière ?","nasai","openiti-sunan-nasai",["prayer"],TOPICS["prayer"][1]),
("route-nasai-fasting","Que rapporte Sunan al-Nasai sur le jeûne ?","nasai","openiti-sunan-nasai",["fasting"],TOPICS["fasting"][1]),
]

MADHHAB = [
("madhhab-maliki-combine","Selon le madhhab malikite, que disent les sources sur le regroupement des prières en voyage ?","Mālikite","Malikite","combine-prayers"),
("madhhab-maliki-wudu","Selon les malikites, que disent les sources sur le wudu ?","Mālikite","Malikite","wudu"),
("madhhab-maliki-marriage","Selon le fiqh malikite, que disent les sources sur le mariage ?","Mālikite","Malikite","marriage"),
("madhhab-maliki-fasting","Selon le madhhab malikite, que disent les sources sur le jeûne ?","Mālikite","Malikite","fasting"),
("madhhab-hanafi-wudu","Selon le madhhab hanafite, que disent les sources sur le wudu ?","Hanafite","Hanafite","wudu"),
("madhhab-hanafi-travel","Selon le fiqh hanafite, que disent les sources sur le voyageur ?","Hanafite","Hanafite","travel"),
("madhhab-shafii-wudu","Selon le madhhab shafiite, que disent les sources sur le wudu ?","Shafiite","Shafiite","wudu"),
("madhhab-shafii-fasting","Selon le fiqh shafiite, que disent les sources sur le jeûne ?","Shafiite","Shafiite","fasting"),
("madhhab-hanbali-wudu","Selon le madhhab hanbalite, que disent les sources sur le wudu ?","Hanbalite","Hanbalite","wudu"),
("madhhab-hanbali-marriage","Selon le fiqh hanbalite, que disent les sources sur le mariage ?","Hanbalite","Hanbalite","marriage"),
]

NEG = [
("neg-quantum-pluto","Quel est le statut du moteur quantique de Pluton dans les ouvrages de fiqh ?"),
("neg-mars-carburetor","Que disent les sources classiques sur le carburateur d'une fusée habitée vers Mars ?"),
("neg-fake-nawawi-electric","Que dit le traité classique Kitab al-Muharrik al-Nawawi sur les moteurs électriques ?"),
("neg-smartphone-battery","Que disent les juristes médiévaux sur la batterie lithium-ion d'un smartphone 5G ?"),
("neg-antimatter","Quel chapitre des livres classiques traite du réacteur à antimatière interstellaire ?"),
("neg-fake-tabari-ai","Que dit Tafsir al-Tabari sur les réseaux de neurones artificiels et les GPU ?"),
("neg-fake-bukhari-ethernet","Que rapporte Sahih al-Bukhari sur le protocole Ethernet 100 gigabits ?"),
("neg-space-elevator","Que disent les sources classiques sur l'ascenseur spatial en nanotubes de carbone ?"),
("neg-dna-printer","Quel est le jugement du fiqh classique sur une imprimante ADN quantique de laboratoire ?"),
("neg-fake-book-robot","Que dit Kitab al-Robot al-Andalusi sur les servomoteurs électriques autonomes ?"),
]

GOLD_CHUNKS = {}


def build_dataset() -> dict:
    cases = []
    templates = ["Que disent les sources sur {x} ?","Quels passages parlent de {x} ?","Que trouve-t-on dans les ouvrages au sujet de {x} ?"]
    for slug, (concepts, groups, labels) in TOPICS.items():
        for i, (template, label) in enumerate(zip(templates, labels), 1):
            cases.append({"id":f"fr-{slug}-{i}","category":"concept-fr","question":template.format(x=label),"expected_concepts":concepts,"expected_term_groups":groups})
    for cid, question, slug in AR:
        cases.append({"id":cid,"category":"multilingual-ar","question":question,"expected_term_groups":TOPICS[slug][1]})
    for cid, question, slug in MIX:
        cases.append({"id":cid,"category":"multilingual-mixed","question":question,"expected_concepts":TOPICS[slug][0],"expected_term_groups":TOPICS[slug][1]})
    for cid, question, route, book, concepts, groups in ROUTES:
        cases.append({"id":cid,"category":"book-routing","question":question,"expected_route_contains":route,"gold_book_ids":[book],"expected_concepts":concepts,"expected_term_groups":groups})
    for cid, question, madhhab, expected, slug in MADHHAB:
        cases.append({"id":cid,"category":"madhhab-filter","question":question,"madhhab":madhhab,"discipline":"Fiqh","expected_source_madhhab_contains":expected,"expected_concepts":TOPICS[slug][0],"expected_term_groups":TOPICS[slug][1]})
    for cid, question in NEG:
        cases.append({"id":cid,"category":"abstention-hard","question":question,"expect_no_evidence":True})
    for case in cases:
        if case["id"] in GOLD_CHUNKS:
            case["gold_chunk_ids"] = GOLD_CHUNKS[case["id"]]
            case["gold_status"] = "validated_semantic"
    assert len(cases) == 200, len(cases)
    assert len({c["id"] for c in cases}) == 200
    return {"version":"6.1","name":"Athar Research Extended Retrieval & Reliability Benchmark","notice":"200 cas. Les proxies lexicaux ne sont pas un Recall académique. Les gold chunks sont ajoutés uniquement après validation sémantique.","default_limit":10,"gold_policy":{"accepted_statuses":["validated_semantic","validated_bibliographic"],"minimum_gold_cases_for_academic_label":50},"cases":cases}


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--output", type=Path, required=True)
    args = p.parse_args()
    payload = build_dataset()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"version":payload["version"],"cases":len(payload["cases"])}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
