import axios from 'axios';

const API_URL = `http://localhost:8080/planify/image`;

export const uploadImage = async(file) => {
	const token = localStorage.getItem("accessToken");
	const formData = new FormData();
	formData.append("file", file);
	return await axios.post(API_URL, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: `Bearer ${token}`,
		},
<<<<<<< HEAD
		withCredentials: true,
=======
        withCredentials: true,
>>>>>>> b1b6a5ee0d0ca0408fad574366f63cffecf87d6c
	});
};