export function getFallbackTrials() {
    return [
        {
            name: "Advanced Diabetes Management Study",
            icon: "💉",
            description: "Testing novel insulin delivery system with AI-driven dosage optimization",
            criteria: {
                condition: "Diabetes",
                minAge: 25,
                maxAge: 70,
                minBloodSugar: 140,
                maxPreviousTreatments: 1,
                requiredTests: ["HbA1c", "Fasting Glucose"]
            },
            requiredParticipants: 5,
            budget: 2500,
            difficulty: "Medium",
            duration: 12,
            measurements: ["Blood Glucose", "Insulin Levels", "HbA1c"]
        },
        {
            name: "Cognitive Behavioral Therapy for Anxiety",
            icon: "😰",
            description: "Virtual reality-assisted CBT for treatment-resistant anxiety",
            criteria: {
                condition: "Anxiety",
                minAge: 18,
                maxAge: 65,
                minSeverity: 3,
                noCurrentMedication: true,
                requiredTests: ["GAD-7", "PHQ-9"]
            },
            requiredParticipants: 8,
            budget: 3000,
            difficulty: "Hard",
            duration: 16,
            measurements: ["Anxiety Scores", "Cortisol Levels"]
        },
        {
            name: "Innovative Arthritis Treatment",
            icon: "🦴",
            description: "Testing new biologics for rheumatoid arthritis with personalized dosing",
            criteria: {
                condition: "Arthritis",
                minAge: 30,
                maxAge: 75,
                minSeverity: 2,
                noRecentSurgery: true,
                requiredTests: ["RF Factor", "Anti-CCP"]
            },
            requiredParticipants: 6,
            budget: 3500,
            difficulty: "Medium",
            duration: 24,
            measurements: ["Joint Mobility", "Pain Scores", "Inflammation Markers"]
        }
    ];
}

export function getIconForCondition(condition) {
    const icons = {
        'diabetes': '💉',
        'hypertension': '❤️',
        'arthritis': '🦴',
        'asthma': '🫁',
        'depression': '🧠',
        'anxiety': '😰',
        'cancer': '🔬',
        'obesity': '⚖️',
        'alzheimers': '🤔',
        'parkinsons': '🤝',
        default: '🏥'
    };
    return icons[condition.toLowerCase()] || icons.default;
} 