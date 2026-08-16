from __future__ import annotations

import argparse
import json
from pathlib import Path

# Ces passages ont été relus sémantiquement dans les extraits du premier run V6.1.
# Ils ne sont pas promus gold par simple égalité avec le top-1 du retriever : chaque
# extrait a été vérifié comme portant réellement sur le sujet de la question.
# Le validateur reste un contrôle sémantique assistant, pas une revue académique externe.
GOLD = {
    "fr-prayer-1": ["openiti-65bc42736d1550f271d05b36"],
    "fr-recitation-silent-1": ["openiti-0c78b2a9e55055a76c375eab"],
    "fr-recitation-1": ["openiti-d20e5b9a47dd0644c9151097"],
    "fr-fatiha-1": ["openiti-316191475631c30c5391e8f7"],
    "fr-basmala-1": ["openiti-0f0203577e466fe061817254"],
    "fr-witr-1": ["openiti-11f9c2fb9bef5185a9cf259a"],
    "fr-qunut-1": ["openiti-5df98480602d2bb89da0c3fc"],
    "fr-ruku-1": ["openiti-e45124a3eb02a51e323d0b05"],
    "fr-sujud-1": ["openiti-b8757badc4848ca1a8ab45b3"],
    "fr-tashahhud-1": ["openiti-dd9cae770d2a3dbe41f6c5a2"],
    "fr-takbir-1": ["openiti-4df494a171bcd38711d65706"],
    "fr-taslim-1": ["openiti-2f4d35391348bc1d4d0d9b93"],
    "fr-adhan-1": ["openiti-087311a130a60d680f646f01"],
    "fr-iqama-1": ["openiti-c1528029638d837ab5bb9083"],
    "fr-congregation-1": ["openiti-628d86fa07365a912c5987ab"],
    "fr-imam-1": ["openiti-5f6dd3c56a8408ad4322d0ca"],
    "fr-friday-prayer-1": ["openiti-e419ba0d1532956a57d1b0a1"],
    "fr-prayer-times-1": ["openiti-44e8e4b7d8681f9725ce33f9"],
    "fr-fajr-1": ["openiti-3788bedac358ec5ca48605a8"],
    "fr-dhuhr-1": ["openiti-7955e6a73a3ffcf5405a0071"],
    "fr-asr-1": ["openiti-15157126992fce83d49240eb"],
    "fr-maghrib-1": ["openiti-3788bedac358ec5ca48605a8"],
    "fr-isha-1": ["openiti-15157126992fce83d49240eb"],
    "fr-travel-1": ["openiti-10e27097578c3edc818d447b"],
    "fr-combine-prayers-1": ["openiti-3f9b6af7eaa74736449481f6"],
    "fr-shorten-prayer-1": ["openiti-74ac5d88dd461cc1f3ec912d"],
    "fr-purification-1": ["openiti-41ad09abf49c145164f18e1d"],
    "fr-wudu-1": ["openiti-b731ce6f49a189aecb1cfe50"],
    "fr-ghusl-1": ["openiti-85ce8b61bc37a4e5ed501293"],
    "fr-tayammum-1": ["openiti-b8038c75b5d63429de6dc663"],
    "fr-menstruation-1": ["openiti-602adcc4b031b386253f7b18"],
    "fr-fasting-1": ["openiti-066b50b3955420b3495b965e"],
    "fr-zakat-1": ["openiti-93abce93fcfc16b9b0ba3723"],
    "fr-marriage-1": ["openiti-2fedd2824f6c2e47beedd34d"],
    "fr-divorce-1": ["openiti-051cdd1559a3afd4b48d31c5"],
    "fr-inheritance-1": ["openiti-4c910a23cb2b5cbeb4ad6e41"],
    "fr-riba-1": ["openiti-f891507a525e1070e900745e"],
    "fr-badr-1": ["openiti-752e2394c060449e14f9a9ef"],
    "fr-ayat-kursi-1": ["openiti-3cbdaba7bb053adf00937e38"],
    "fr-eclipse-prayer-1": ["openiti-1207955312570a112ceb3ae2"],
    "route-bukhari-intention": ["openiti-5c036187c0a57544e4f6669a"],
    "route-muslim-purification": ["openiti-2460cff7690256ec8a53298e"],
    "route-tabari-fatiha": ["openiti-4c2aa3a69b8eb83f6d8b162e"],
    "route-tabari-kursi": ["openiti-014f6108ec0bcc9043b671e7"],
    "route-ibn-kathir-fatiha": ["openiti-316191475631c30c5391e8f7"],
    "route-ibn-hisham-badr": ["openiti-860a1ba1b6b378ae5ae5632e"],
    "route-tirmidhi-witr": ["openiti-54f4b795f7b0b0d5ac8aa413"],
    "route-muwatta-prayer": ["openiti-f0b8111f7571be40922a0e68"],
    "route-bidayat-combine": ["openiti-c9be10ea6697f927488ac60f"],
    "route-abudawud-wudu": ["openiti-8995b5876e6a2e412956c9aa"],
}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset", type=Path, required=True)
    args = parser.parse_args()
    payload = json.loads(args.dataset.read_text(encoding="utf-8"))
    cases = {str(case["id"]): case for case in payload.get("cases") or []}
    missing = sorted(set(GOLD) - set(cases))
    if missing:
        raise RuntimeError(f"Cas gold absents du dataset: {missing}")
    for case_id, chunk_ids in GOLD.items():
        case = cases[case_id]
        case["gold_chunk_ids"] = list(chunk_ids)
        case["gold_status"] = "validated_semantic"
        case["gold_validator"] = "assistant_semantic_review"
    payload["gold_annotation"] = {
        "cases": len(GOLD),
        "validator": "assistant_semantic_review",
        "scope": "semantic relevance of retrieved excerpt; not exhaustive scholarly relevance judgment",
    }
    args.dataset.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(payload["gold_annotation"], ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
