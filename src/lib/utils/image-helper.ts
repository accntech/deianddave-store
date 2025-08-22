export const transform = (url: string, insertStr: string, marker = 'upload/') => {
	const idx = url.indexOf(marker);
	if (idx === -1) return url;
	const insertPos = idx + marker.length;
	return url.substring(0, insertPos) + insertStr + '/' + url.substring(insertPos);
};
