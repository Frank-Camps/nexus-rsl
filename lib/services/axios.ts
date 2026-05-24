import axios, { AxiosResponse, AxiosError } from 'axios';

/**
 * FETCHERS POUR useSWR (Lecture)
 * Utilise la méthode GET par défaut pour récupérer les données.
 */
export const queryer = async (url: string) => {
    try {
        const response = await axios.get(url);
        return response.data; // SWR attend les données directement
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data; // SWR gère les erreurs via .error
        }
        throw new Error('Une erreur inattendue est survenue');
    }
};

/**
 * MUTATORS POUR useSWRMutation (Écriture)
 * payload.arg contiendra les données envoyées par trigger()
 */
export const sendMutation = async <T>(
    url: string,
    { arg }: { arg: T }
) => {
    try {
        const response = await axios({
            method: 'POST', // On peut le rendre dynamique si besoin (PUT/DELETE)
            url,
            data: arg,
            headers: { 'Content-Type': 'application/json' }
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('Erreur lors de la mutation');
    }
};

/**
 * Version spécifique pour DELETE (si tu en as besoin)
 */
export const deleteMutation = async (url: string, { arg }: { arg: { id: string } }) => {
    try {
        // syntaxe obligatoire pour envoyer un body en DELETE avec Axios
        const response = await axios.delete(url, { data: arg });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('Erreur lors de la suppression');
    }
};

export const updateMutation = async (url: string, { arg }: { arg: any }) => {
    try {
        const response = await axios.put(url, arg);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) throw error.response.data;
        throw new Error('Erreur lors de la modification');
    }
};