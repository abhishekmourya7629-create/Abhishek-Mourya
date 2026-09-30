import json
import random
import uuid
import os
from datetime import datetime, timedelta
from ..models.database import get_connection, init_db, log_audit
from ..intake.privacy import mask_pii

def load_gazetteer():
    json_path = os.path.join(os.path.dirname(__file__), "brics_countries.json")
    with open(json_path, "r", encoding="utf-8") as f:
        return json.load(f)

# High-fidelity multilingual templates
TEMPLATES = {
    "India": {
        "hi": [
            ("water", "borewell_failure", "critical", "farmers_families", "बांदा के बबेरू गांव में सारे हैंडपंप और कुएं सूख चुके हैं, 3 किमी दूर से पानी लाना पड़ता है। कृपया तत्काल नया बोरवेल लगवाएं।", "Banda"),
            ("water", "pipeline_leakage", "high", "residents", "महोबा चरखारी रोड पर मुख्य पेयजल पाइपलाइन दो हफ्ते से टूटी है, गंदा पानी नलों में आ रहा है।", "Mahoba"),
            ("water", "fluoride_contamination", "critical", "children_elders", "चित्रकूट के मऊ क्षेत्र में पानी में अत्यधिक फ्लोराइड है, कई बच्चों के दांत और हड्डियां खराब हो रही हैं। स्वच्छ जल संयंत्र चाहिए।", "Chitrakoot"),
            ("roads", "bridge_damage", "high", "rural_commuters", "बांदा तिंदवारी मार्ग पर बारिश से पुलिया बह गई है, चार गांवों का संपर्क जिला अस्पताल से कट गया है।", "Banda"),
            ("health", "clinic_shortage", "critical", "pregnant_women", "महोबा प्राथमिक स्वास्थ्य केंद्र में 2 महीने से कोई महिला डॉक्टर नहीं है, प्रसव के लिए 50 किमी जाना पड़ता है।", "Mahoba"),
            ("electricity", "transformer_burnout", "medium", "students", "चित्रकूट राजापुर में ट्रांसफार्मर जलने से 5 दिन से अंधेरा है, बच्चों की परीक्षा की तैयारी रुक गई है।", "Chitrakoot"),
            ("water", "tanker_mafia", "high", "slum_dwellers", "बांदा अतर्रा में जल संकट का फायदा उठाकर निजी टैंकर वाले 500 रुपये प्रति ड्रम वसूल रहे हैं। सरकारी टैंकर भेजे जाएं।", "Banda"),
            ("schools", "roof_leakage", "medium", "students", "महोबा कबरई के प्राथमिक विद्यालय की छत जर्जर है, बारिश में कक्षा में पानी भर जाता है।", "Mahoba")
        ],
        "mr": [
            ("water", "sewage_overflow", "critical", "slum_residents", "धारावी 90 फीट रोडवर नाल्याचे घाण पाणी तुंबून चाळीत शिरले आहे. लेकरांना उलट्या-जुलाब होत आहेत, त्वरित ड्रेनेज साफ करा.", "Mumbai Suburban"),
            ("water", "contaminated_supply", "high", "chawl_residents", "कुर्ला कसाईवाडा भागात नळाला पिवळे आणि दुर्गंधीयुक्त पाणी येत आहे. महापालिकेने तातडीने तपासणी करावी.", "Mumbai Suburban"),
            ("health", "emergency_transit", "critical", "tribal_mothers", "गडचिरोली भामरागड पाड्यात पक्का रस्ता आणि ॲम्ब्युलन्स नसल्याने गरोदर मातेला बांबूच्या डोलीतून न्यावे लागले.", "Gadchiroli"),
            ("roads", "forest_culvert", "high", "tribal_villagers", "गडचिरोली अहेरी मार्गावरील नाला पावसाळ्यात भरल्याने 10 खेड्यांचा संपर्क तुटतो, येथे उंच पुलाची गरज आहे.", "Gadchiroli"),
            ("schools", "no_teachers", "medium", "tribal_students", "गडचिरोली सिरोंचा आश्रमशाळेत विज्ञान आणि गणिताचे शिक्षक 6 महिन्यांपासून नाहीत.", "Gadchiroli"),
            ("electricity", "feeder_tripping", "medium", "small_businesses", "गोवंडी शिवाजी नगरमध्ये दिवसभरात 8 वेळा वीज जाते, स्थानिक लघुउद्योग ठप्प झाले आहेत.", "Mumbai Suburban")
        ],
        "en-IN": [
            ("water", "dry_tubewell", "critical", "farmers", "In Banda district, all 4 borewells in our panchayat have dried up completely. Women walk 4 hours daily. Please sanction emergency solar pump.", "Banda"),
            ("water", "drainage_choke", "high", "urban_poor", "Dharavi Transit Camp sector 5 gutter is overflowing into food stalls, severe malaria risk.", "Mumbai Suburban"),
            ("health", "no_medicines", "critical", "tribal_patients", "Gadchiroli sub-center has no anti-snake venom or basic fever medicine available for weeks.", "Gadchiroli"),
            ("broadband", "optical_fiber", "low", "tech_workers", "South Delhi Greater Kailash 2 needs upgrade from 300Mbps to 1Gbps public fiber loop.", "South Delhi"),
            ("roads", "minor_pothole", "low", "commuters", "South Delhi Ring Road near defense colony flyover has slight tarmac unevenness, please resurface.", "South Delhi")
        ]
    },
    "Brazil": {
        "pt": [
            ("roads", "bridge_collapse", "critical", "rural_farmers", "Na zona rural de Caruaru, a ponte de madeira do Riacho do Peixe caiu com a chuva e 80 famílias de agricultores estão isoladas.", "Caruaru"),
            ("roads", "unpaved_mud", "high", "dairy_producers", "Estrada vicinal entre Caruaru e o distrito de Malhada de Pedras está intransitável, caminhão de leite não entra.", "Caruaru"),
            ("roads", "crater_potholes", "high", "bus_passengers", "Trecho que liga Caruaru a Toritama com crateras enormes provocando quebra diária de ônibus de trabalhadores.", "Caruaru"),
            ("health", "no_physician", "critical", "elderly_mothers", "No PSF de Garanhuns falta médico de família há dois meses e a geladeira de vacinas queimou.", "Garanhuns"),
            ("water", "drought_tankers", "high", "rural_residents", "Garanhuns distrito de São Pedro está há 18 dias sem abastecimento de água encanada pela Compesa.", "Garanhuns"),
            ("health", "boat_ambulance", "critical", "riverine_communities", "Comunidade ribeirinha em Manaus solicita barco-ambulância de urgência para resgate de picadas de animais peçonhentos.", "Manaus"),
            ("broadband", "luxury_smart_pole", "low", "tech_executives", "Pinheiros em São Paulo solicita sensores IoT adicionais para monitoramento de postes inteligentes.", "Pinheiros")
        ]
    },
    "South Africa": {
        "zu": [
            ("health", "clinic_power_outage", "critical", "maternity_patients", "Emtholampilo waseVhembe akukho gesi njalo kanti nomshini wokubelethisa awusebenzi. Abesifazane baphathwa kabi.", "Vhembe"),
            ("health", "medicine_stockout", "critical", "chronic_patients", "Umtholampilo waseVhembe awunawo amaphilisi e-HIV nesifo sikashukela kusukela ngenyanga edlule.", "Vhembe"),
            ("health", "nurse_shortage", "high", "rural_families", "eVhembe kukhona umhlengikazi oyedwa kuphela osebenza ezigulini ezingaphezu kwamakhulu amathathu ngosuku.", "Vhembe"),
            ("water", "broken_borewell", "critical", "villagers", "Amapayipi amanzi eMopani afile, umphakathi uphuza amanzi angcolile emfuleni nezilwane.", "Mopani"),
            ("water", "dry_taps", "high", "mothers", "eMopani sesiphelele amasonto amathathu singenawo amanzi emapompini, izingane azikwazi ukuya esikoleni.", "Mopani"),
            ("electricity", "blown_transformer", "high", "township_residents", "Ugesi uhlale ucima e-Alexandra ngenxa ye-transformer esishile, izitolo zilahlekelwa ukudla.", "Alexandra"),
            ("broadband", "fiber_density", "low", "corporate_offices", "Sandton corporate towers require ultra-low latency redundant 5G microcell pole installation.", "Sandton")
        ]
    },
    "Russia": {
        "ru": [
            ("electricity", "district_heating_rupture", "critical", "apartment_residents", "В Якутске по улице Дзержинского прорыв теплотрассы в минус 42 градуса, батареи остыли в 12 многоквартирных домах.", "Yakutsk"),
            ("electricity", "substation_overload", "high", "freezing_citizens", "В пригороде Якутска регулярные аварийные отключения электроэнергии, насосы отопления останавливаются.", "Yakutsk"),
            ("schools", "boiler_failure", "critical", "schoolchildren", "В поселковой школе Биробиджана сломался угольный котел, дети учатся в зимних куртках при температуре +5 градусов.", "Birobidzhan"),
            ("roads", "permafrost_heave", "high", "freight_drivers", "Трасса под Якутском просела из-за таяния вечной мерзлоты, глубокие провалы блокируют подвоз продовольствия.", "Yakutsk"),
            ("roads", "ice_crossing_safety", "medium", "rural_settlers", "Ледовая переправа через Лену не оборудована спасательными постами и освещением.", "Yakutsk")
        ]
    },
    "China": {
        "zh": [
            ("schools", "rural_heating", "critical", "rural_pupils", "周口市太康县农村小学教室冬天没有暖气，窗户漏风严重，几十个孩子双手生了冻疮，急需安装电暖器。", "Zhoukou"),
            ("schools", "leaking_classroom", "high", "primary_students", "周口扶沟县教学楼屋顶严重漏雨，图书室和微机室被水泡损，急需屋顶修缮专项资金。", "Zhoukou"),
            ("broadband", "remote_education", "high", "students_teachers", "周口偏远自然村完全没有百兆光纤宽带，留守儿童无法参加远程网课和名师辅导。", "Zhoukou"),
            ("roads", "cliff_guardrail", "critical", "mountain_villagers", "大凉山悬崖村通往中心小学的盘山急弯处缺乏钢制波形护栏，雨季多次发生落石事故。", "Liangshan"),
            ("health", "telemedicine_link", "high", "ethnic_minority", "大凉山高海拔卫生室缺乏远程会诊数字化心电图设备，急症老人难以及时送医。", "Liangshan"),
            ("roads", "aesthetic_lighting", "low", "cbd_pedestrians", "陆家嘴金融街区请求增设智慧景观跑马灯与氛围彩灯。", "Liangshan")
        ]
    }
}

CHANNELS = ["whatsapp", "voice", "sms", "web"]
CHANNEL_WEIGHTS = [0.42, 0.28, 0.20, 0.10]

SAMPLE_NAMES = {
    "India": ["Ramesh Sharma", "Sunita Devi", "Anil Patel", "Kavita Rao", "Mahesh Yadav", "Rekha Verma", "Rajeshwari G", "Deepak Lodhi", "Santosh Gond", "Pooja Jadhav", "Baliram Rathod"],
    "Brazil": ["Carlos Silva", "Ana Oliveira", "Marcos Santos", "Beatriz Costa", "Joao Ferreira", "Maria Aparecida", "Lucas Menezes", "Fernanda Lima"],
    "South Africa": ["Sipho Ndlovu", "Zanele Khumalo", "Thabo Dlamini", "Nandi Mokoena", "Bongani Sithole", "Nomvula Zulu", "Kagiso Molefe"],
    "Russia": ["Ivan Petrov", "Elena Sidorova", "Dmitry Smirnov", "Olga Kuznetsova", "Sergey Morozov", "Anna Vasilyeva", "Alexey Popov"],
    "China": ["Zhang Wei", "Li Na", "Wang Qiang", "Liu Yang", "Chen Jie", "Zhao Min", "Sun Lei", "Zhou Feng"]
}

def generate_synthetic_data(target_count: int = 1500):
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    
    # Check if already seeded
    cursor.execute("SELECT COUNT(*) FROM citizen_requests")
    existing_count = cursor.fetchone()[0]
    if existing_count >= target_count:
        print(f"Database already seeded with {existing_count} records.")
        conn.close()
        return existing_count

    # Clear previous seed if partial
    cursor.execute("DELETE FROM citizen_requests")
    cursor.execute("DELETE FROM districts")
    cursor.execute("DELETE FROM human_review_queue")
    cursor.execute("DELETE FROM audit_log")
    cursor.execute("DELETE FROM impact_ledger")
    conn.commit()

    gazetteer = load_gazetteer()

    # 1. Insert Districts
    district_lookup = {}
    for country, country_data in gazetteer.items():
        for d in country_data["districts"]:
            key = (country, d["district"])
            district_lookup[key] = d
            cursor.execute("""
            INSERT INTO districts (district, state, country, lat, lng, population, poverty_index, infrastructure_index_json, planned_investment_json, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                d["district"], d["state"], country, d["lat"], d["lng"],
                d["population"], d["poverty_index"],
                json.dumps(d["infrastructure_index"]),
                json.dumps(d["planned_investment_usd_m"]),
                d["description"]
            ))
    conn.commit()

    # 2. Generate Requests
    # Distribution plan to reach ~1500:
    # India: 850 (Banda: 220, Mumbai Suburban: 260, Mahoba: 80, Chitrakoot: 70, Gadchiroli: 90, Kalahandi: 50, Barmer: 40, Wayanad: 30, South Delhi: 10)
    # Brazil: 240 (Caruaru: 140, Garanhuns: 50, Manaus: 45, Pinheiros: 5)
    # South Africa: 220 (Vhembe: 130, Mopani: 50, Alexandra: 35, Sandton: 5)
    # Russia: 100 (Yakutsk: 65, Birobidzhan: 35)
    # China: 120 (Zhoukou: 75, Liangshan: 45)
    # Total = 850 + 240 + 220 + 100 + 120 = 1530 requests!

    quota = {
        ("India", "Banda"): 220,
        ("India", "Mumbai Suburban"): 260,
        ("India", "Mahoba"): 80,
        ("India", "Chitrakoot"): 70,
        ("India", "Gadchiroli"): 90,
        ("India", "Kalahandi"): 50,
        ("India", "Barmer"): 40,
        ("India", "Wayanad"): 30,
        ("India", "South Delhi"): 10,
        ("Brazil", "Caruaru"): 140,
        ("Brazil", "Garanhuns"): 50,
        ("Brazil", "Manaus"): 45,
        ("Brazil", "Pinheiros"): 5,
        ("South Africa", "Vhembe"): 130,
        ("South Africa", "Mopani"): 50,
        ("South Africa", "Alexandra"): 35,
        ("South Africa", "Sandton"): 5,
        ("Russia", "Yakutsk"): 65,
        ("Russia", "Birobidzhan"): 35,
        ("China", "Zhoukou"): 75,
        ("China", "Liangshan"): 45
    }

    requests_to_insert = []
    review_queue_items = []
    base_time = datetime.utcnow() - timedelta(days=45)

    request_counter = 1
    for (country, district_name), target_num in quota.items():
        dist_info = district_lookup[(country, district_name)]
        country_templates = TEMPLATES.get(country, {})
        lang_keys = list(country_templates.keys())

        for _ in range(target_num):
            lang = random.choice(lang_keys)
            tpl_list = country_templates[lang]
            
            # Pick a template matching the district if possible, else random
            matching_tpls = [t for t in tpl_list if t[5] == district_name]
            tpl = random.choice(matching_tpls if matching_tpls else tpl_list)
            
            sector, sub_type, severity, group, raw_text, _ = tpl
            
            # Minor random variation in text
            variations = [
                raw_text,
                f"{raw_text} [शिकायत संख्या/Token #{random.randint(100, 999)}]",
                f"Urgent attention required: {raw_text}",
                f"{raw_text} Gram Panchayat Ward #{random.randint(1, 12)}."
            ]
            chosen_text = random.choice(variations)
            
            # Channel
            channel = random.choices(CHANNELS, weights=CHANNEL_WEIGHTS)[0]
            
            # Timestamp spread over 45 days
            created_at = (base_time + timedelta(
                days=random.randint(0, 44),
                hours=random.randint(0, 23),
                minutes=random.randint(0, 59)
            )).isoformat() + "Z"

            # Name and phone
            raw_name = random.choice(SAMPLE_NAMES.get(country, ["Citizen"]))
            raw_phone = f"+{random.randint(10, 99)} {random.randint(70000, 99999)} {random.randint(10000, 99999)}"
            masked_name, masked_phone = mask_pii(raw_name, raw_phone)

            # Translation simulation
            # If native, provide clean English pivot
            translated_text = chosen_text
            if lang in ["hi", "mr", "pt", "zu", "ru", "zh"]:
                translated_text = f"[Translated from {lang.upper()}]: {chosen_text}"

            # Determine confidence (seed ~2% into human review queue)
            is_low_conf = (random.random() < 0.02) or (request_counter in [15, 42, 89, 142, 210, 305, 412, 530, 610, 725, 840, 950, 1100, 1250, 1380])
            confidence = round(random.uniform(0.52, 0.72), 2) if is_low_conf else round(random.uniform(0.85, 0.99), 2)
            review_status = "pending_review" if is_low_conf else "approved"

            req_id = f"req_{country[:2].lower()}_{request_counter:04d}"
            
            # Add slight jitter to district coordinates so map markers don't overlap completely
            lat_jitter = dist_info["lat"] + random.uniform(-0.04, 0.04)
            lng_jitter = dist_info["lng"] + random.uniform(-0.04, 0.04)

            record = (
                req_id, channel, chosen_text, translated_text, lang,
                masked_name, masked_phone, 1, sector, sub_type, severity,
                group, district_name, confidence, district_name, dist_info["state"],
                country, lat_jitter, lng_jitter, f"cluster_{district_name}_{sector}",
                review_status, created_at
            )
            requests_to_insert.append(record)

            if is_low_conf:
                review_item = (
                    f"rev_{req_id}", req_id, chosen_text, translated_text, channel,
                    lang, confidence, json.dumps({
                        "sector": sector,
                        "sub_type": sub_type,
                        "severity": severity,
                        "affected_group": group,
                        "location_mention": district_name
                    }), "Low extraction confidence / ambiguous dialect idiom detected by AI classifier.",
                    "pending_review", created_at
                )
                review_queue_items.append(review_item)

            request_counter += 1

    cursor.executemany("""
    INSERT INTO citizen_requests (
        id, channel, original_text, translated_text, detected_language,
        masked_name, masked_phone, consent_granted, sector, sub_type, severity,
        affected_group, location_mention, confidence, district, state,
        country, lat, lng, cluster_id, review_status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, requests_to_insert)

    cursor.executemany("""
    INSERT INTO human_review_queue (
        id, request_id, original_text, translated_text, channel,
        detected_language, confidence, extracted_json, reviewer_notes, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, review_queue_items)

    # 3. Seed Initial Impact Ledger Items ("You said, we did")
    impact_items = [
        ("imp_001", "rec_ind_01", "Bundelkhand Emergency Solar Deep Tube-Wells", "Banda", "water", 0.15, 0.58, 0.85, 91.4, "in_progress", "2026-09-15"),
        ("imp_002", "rec_ind_02", "Dharavi Sector 5 Underground Storm Drainage", "Mumbai Suburban", "water", 0.40, 0.74, 0.90, 88.2, "completed", "2026-08-30"),
        ("imp_003", "rec_bra_01", "Caruaru Rural Bridge & Agricultural Paving", "Caruaru", "roads", 0.22, 0.65, 0.80, 94.0, "completed", "2026-07-20"),
        ("imp_004", "rec_za_01", "Vhembe District Clinic Solar Backup & Maternity Ward", "Vhembe", "health", 0.21, 0.52, 0.75, 87.6, "in_progress", "2026-09-10"),
        ("imp_005", "rec_ru_01", "Yakutsk North Thermal Main Insulation Overhaul", "Yakutsk", "electricity", 0.45, 0.82, 0.95, 96.1, "completed", "2026-08-05")
    ]
    cursor.executemany("""
    INSERT INTO impact_ledger (id, project_id, title, district, sector, baseline_metric, current_metric, target_metric, citizen_satisfaction_rate, status, last_verified)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, impact_items)

    conn.commit()
    conn.close()

    log_audit("Data Pipeline Engine", "SYNTHETIC_DATA_GENERATE", f"Generated {len(requests_to_insert)} citizen requests across BRICS with {len(review_queue_items)} flagged for human review.")
    print(f"Successfully generated {len(requests_to_insert)} citizen requests and {len(review_queue_items)} review items.")
    return len(requests_to_insert)

if __name__ == "__main__":
    generate_synthetic_data()
