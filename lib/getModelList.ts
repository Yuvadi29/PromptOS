export async function getModelList() {
    const url = 'https://openrouter.ai/api/v1/models';
    const options = { method: 'GET' };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data
    } catch (error) {
        console.error(error);
    }
}