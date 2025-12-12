



export async function apiClient(callback) {

    const response = await callback();
    console.log("apiClient response ", response);
    if (response.data.status === 401) {
        //refresh token 
        const refresh= localStorage.getItem("refreshToken");
        const refreshResponse = await axios.post("http://localhost:5000/api/auth/refresh", {
            refresh_token: refresh
        });

        if (refreshResponse.data.success) {
            localStorage.setItem("token", refreshResponse.data.data.token);
            localStorage.setItem("refreshToken", refreshResponse.data.data.refreshToken);

            //retry original request
            return await callback();
        } else {
            //logout user
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
            return;
        }

    }
    return response;
}
