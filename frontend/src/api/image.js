import httpAuth from './httpAuth';

export const uploadImage = async(file) => {
	const formData = new FormData();
	formData.append("file", file);
	return await httpAuth.post('/image', formData);
};