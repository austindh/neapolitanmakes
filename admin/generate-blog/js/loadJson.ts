export const loadJson = async (jsonFilename) => {
	const response = await fetch(`/json/${jsonFilename}`);
	return await response.json();
}
