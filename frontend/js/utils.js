
export function loadContent(page, url, addToHistory) {
	$('#app').html(page);
	if (addToHistory) {
		history.pushState({ page: page }, '', `?page=${url}`);
	}
}