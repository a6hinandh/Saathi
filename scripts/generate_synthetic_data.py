import json
import random
from pathlib import Path

# Setup paths relative to script location
ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / 'backend' / 'data'
DATA_DIR.mkdir(parents=True, exist_ok=True)

# Wordlists for generating realistic transaction notes
BENIGN_TEMPLATES = [
    "Rent payment for {month}",
    "School fees for {name}",
    "Electricity bill",
    "Lunch with {name}",
    "Dinner reimbursement",
    "Gift for {name}",
    "Transfer to family",
    "Monthly savings",
    "Car service",
    "Groceries refund",
    "Office expense",
    "Home repair charges",
    "Books and study material",
    "Gym membership fee",
    "Subscription renewal"
]

SCAM_TEMPLATES = [
    "KYC verification fee",
    "Urgent verification fee",
    "Account unlock charge",
    "Refund processing deposit",
    "RBI compliance payment",
    "Digital arrest bail bond",
    "Income tax penalty release",
    "Customs clearance fee",
    "Lottery processing tax",
    "Tech support security deposit",
    "Credit card verification payment",
    "Anti-money laundering audit charge",
    "Insurance processing clearance",
    "Agent verification fee",
    "Crypto wallet activation fee"
]

MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
NAMES = ["Aarav", "Ananya", "Rahul", "Priya", "Amit", "Neha", "Vikram", "Sneha", "Karan", "Riya", "Raj", "Pooja"]


def generate_notes(count=300):
    notes = []
    
    # Benign notes (Label: BENIGN / 0)
    for i in range(count):
        template = random.choice(BENIGN_TEMPLATES)
        note_text = template.format(
            month=random.choice(MONTHS),
            name=random.choice(NAMES)
        )
        notes.append({
            "case_id": f"BEN-{i:03d}",
            "note": note_text,
            "beneficiary": f"{random.choice(NAMES).lower()}_{random.randint(10,99)}@upi",
            "label": "BENIGN"
        })
        
    # Scam-like notes (Label: SCAM_LIKE / 1)
    for i in range(count):
        template = random.choice(SCAM_TEMPLATES)
        note_text = template
        notes.append({
            "case_id": f"SCAM-{i:03d}",
            "note": note_text,
            "beneficiary": f"agent_{random.randint(100,999)}@upi",
            "label": "SCAM_GUIDED"
        })
        
    return notes


def generate_behavior_profiles(count=300):
    profiles = []
    
    # Benign profiles (Normal typing, low hesitation)
    for _ in range(count):
        profiles.append({
            "profile": "normal",
            "avg_key_interval": round(random.normalvariate(220, 30), 1),
            "typing_variance": round(random.normalvariate(35, 10), 1),
            "backspace_rate": round(max(0.0, random.uniform(0.01, 0.12)), 2),
            "mouse_speed": round(random.normalvariate(1050, 150), 1),
            "confirmation_delay": round(random.uniform(3.0, 10.0), 1),
            "amount_edit_count": random.randint(0, 1),
            "focus_switch_count": random.randint(1, 3),
            "paste_count": 0,
            "hesitation_delay": round(random.uniform(1.0, 4.0), 1)
        })
        
    # Stressed/Coerced profiles (Slow typing, high edits, hesitation, copy-pasting)
    for _ in range(count):
        profiles.append({
            "profile": "high_risk",
            "avg_key_interval": round(random.normalvariate(440, 60), 1),
            "typing_variance": round(random.normalvariate(140, 30), 1),
            "backspace_rate": round(random.uniform(0.18, 0.42), 2),
            "mouse_speed": round(random.normalvariate(480, 100), 1),
            "confirmation_delay": round(random.uniform(18.0, 55.0), 1),
            "amount_edit_count": random.randint(2, 6),
            "focus_switch_count": random.randint(4, 11),
            "paste_count": random.randint(1, 3),
            "hesitation_delay": round(random.uniform(12.0, 40.0), 1)
        })
        
    return profiles


def main():
    print("Generating synthetic datasets...")
    
    notes = generate_notes(300)
    profiles = generate_behavior_profiles(300)
    
    # Save fraud cases
    with open(DATA_DIR / 'fraud_cases.json', 'w', encoding='utf-8') as f:
        json.dump(notes, f, indent=2)
        
    # Save behavioral profiles
    with open(DATA_DIR / 'behavioral_profiles.json', 'w', encoding='utf-8') as f:
        json.dump(profiles, f, indent=2)
        
    print(f"Successfully generated {len(notes)} fraud cases and {len(profiles)} behavioral profiles in {DATA_DIR}")


if __name__ == '__main__':
    main()
