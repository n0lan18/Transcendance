

let translations = {};


export async function translation()
{
	await loadTranslations();
}

async function loadTranslations()
{
	try
	{
        const lang = localStorage.getItem('language') || 'en';
		const response = await fetch(`../lang/${lang}.json`);
		if (!response.ok) {
            throw new Error(`Erreur de chargement du fichier: ${response.statusText}`);
        }
		translations = await response.json();
		applyTranslations()
	}
	catch (error)
	{
		console.error('Erreur de chargement des traductions:', error);
	}
}

function applyTranslations()
{
	document.querySelectorAll("[data-translate-key]").forEach(element => {
		const key = element.getAttribute("data-translate-key");
		if (key == "email")
            element.placeholder = translations[key];
        else if (key == "username" )
            element.placeholder = translations[key];
        else if (key == "password")
            element.placeholder = translations[key];
        else if (key == "updateInput")
            element.value = translations[key];
        else if (key == "play")
            element.value = translations[key];
        else if (key == "start")
            element.value = translations[key];
        else if (key == "startRandom")
            element.value = translations[key];
        else if (key == "follow")
            element.value = translations[key];
        else if (key == "historic-game")
            element.value = translations[key];
        else if (translations[key])
			element.textContent = translations[key];
	});
}

export function changeLanguage(lang)
{
	reorderLanguages(lang);
	localStorage.setItem('language', lang);
}

export function reorderLanguages(selectedLang) {
    const languageSelect = document.getElementById("language-select");
    if (languageSelect)
    {

        // Options dans l'ordre souhaité
        const languages = [
            { value: "en", label: "EN" },
            { value: "fr", label: "FR" },
            { value: "es", label: "ES" },
        ];

        // Trie en plaçant la langue sélectionnée en premier
        const sortedLanguages = [
            languages.find(lang => lang.value === selectedLang),
            ...languages.filter(lang => lang.value !== selectedLang)
        ];

        // Efface les options existantes
        languageSelect.innerHTML = "";

        // Ajoute les options dans le nouvel ordre
        sortedLanguages.forEach(lang => {
            const option = document.createElement("option");
            option.value = lang.value;
            option.textContent = lang.label;
            languageSelect.appendChild(option);
        });

        // Sélectionne la langue choisie
        languageSelect.value = selectedLang;
    }
}