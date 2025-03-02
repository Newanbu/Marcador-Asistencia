
import axios from 'axios'
import Cookies from 'js-cookie'

const BASE_URL = 'http://127.0.0.1:8000/api/'
export const LOGIN_URL = `${BASE_URL}token/`
const REFRESH_URL = `${BASE_URL}token/refresh/`
const NOTES_URL = `${BASE_URL}notes/`
const LOGOUT_URL = `${BASE_URL}logout/`
const AUTH_URL = `${BASE_URL}authenticated/`
const HORA_ENTRADA = `${BASE_URL}hora/entrada/`
const HORA_SALIDA = `${BASE_URL}hora/salida/`
const REGISTER_URL = `${BASE_URL}register/`
const USERS_URl = `${BASE_URL}users/`
const ROLES_URL = `${BASE_URL}roles/`
const USER_URL = `${BASE_URL}user/`





export const login = async (email, password) => {
    try {
        const response = await axios.post(LOGIN_URL, { email, password }, { withCredentials: true });

        if (response.status === 200) {
            return { success: true, data: response.data };
        } else {
            return { success: false, message: 'Credenciales incorrectas' };
        }
    } catch (error) {
        console.error("Error en login:", error);
        return { success: false, message: 'Error al iniciar sesión' };
    }
};

export const update_user = async (id, updatedData) => {
    try {
        const response = await axios.patch(`${USERS_URl}${id}/`, updatedData, {
            withCredentials: true, // Para enviar cookies si usas autenticación
            headers: { "Content-Type": "application/json" }
        });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el usuario:", error.response?.data || error.message);
        throw error;
    }
};


export const register = async(fullname,rut,address,telefono,email,cargo,contrato,rol_usuario,fecha_ingreso,fecha_desvinculacion,password) => {
    try{
        const response = await axios.post(REGISTER_URL,
            {nombre_completo:fullname,
            rut: rut,
            direccion: address,
            numero_telefonico: telefono,
            rol_usuario: rol_usuario,
            email:email,
            cargo:cargo,
            contrato_asignado:contrato,
            fecha_ingreso:fecha_ingreso,
            fecha_desvinculacion: fecha_desvinculacion,
            password:password
            },
            {withCredentials:true}
        )
        if (response.ok){
            console.log('Usuario creado')
        }
    }catch(error){
        console.log(error)
    }
}

export const delete_user = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}users/${id}/`, {
            withCredentials: true,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`, // Envía el token si es necesario
                "Content-Type": "application/json"
            }
        });

        console.log("Usuario eliminado correctamente:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error eliminando usuario:", error.response ? error.response.data : error.message);
        throw error;  // Propagar error para manejarlo en el frontend
    }
};


export const get_roles = async()=>{
    try{
        const response = await axios.get(ROLES_URL,{withCredentials:true})
        return response.data
    }catch(error){
        console.log(error)
    }

}

export const get_user = async () => {
    try {
        const response = await axios.get(`${USER_URL}`, { withCredentials: true });
        console.log("Respuesta de la API:", response.data); // ✅ Verifica qué devuelve la API
        return response.data;  // ✅ Asegurar que devuelve los datos correctos
    } catch (error) {
        console.error("Error al obtener usuario:", error.response?.data || error.message);
        return null;  // ✅ Retorna `null` si hay un error
    }
};


export const get_users = async() => {
    try{
        const response = await axios.get(USERS_URl,{withCredentials:true})
        return response.data
    }catch(error){
        console.log(error)
        return false
    }

}


export const refresh_token = async () =>{
    try{
        const response = await axios.post(REFRESH_URL,
            {},
            {withCredentials:true}
        )
        Cookies.set('access_token', response.data.access, { secure: true, sameSite: 'None' });
        return true
    }
    catch(error){
        console.log(error)
        return false
    }

}

export const addHoraEntrada = async (hora, userId) => {
    try {
        const response = await axios.post(`${BASE_URL}hora/entrada/`, 
        {
            hora_entrada: hora,  
            owner: userId
        }, 
        {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        });

        return response.data;
    } catch (error) {
        console.error("Error al registrar la hora de entrada:", error.response?.data || error.message);
        throw error;
    }
};

export const addHoraSalida = async (hora, userId) => {
    try {
        const response = await axios.post(`${BASE_URL}hora/salida/`, 
        {
            hora_salida: hora,  
            owner: userId
        }, 
        {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        });

        return response.data;
    } catch (error) {
        console.error("Error al registrar la hora de entrada:", error.response?.data || error.message);
        throw error;
    }
};




export const getHoraEntrada = async()=>{
    try{
        const response = await axios.get(HORA_ENTRADA,{
            withCredentials:true
        })
        return response.data
    }
    catch{
        return false
    }
}

export const getHoraSalida = async()=>{
    try{
        const response = await axios.get(HORA_SALIDA,{
            withCredentials:true
        })
        return response.data
    }
    catch{
        return false
    }
}

export const getNotes = async() =>{
    try{
        const response = await axios.get(NOTES_URL,
            {withCredentials:true}
        )
        return response.data
    }
    catch (error){
        call_refresh(error, axios.get(NOTES_URL,{withCredentials:true}))
    }

}


const call_refresh = async (error, func) =>{
    if(error.response && error.response.status === 401){
        const tokenRefreshed = await refresh_token()
        if(tokenRefreshed){
            const retryResponse = await func();
            return retryResponse.data
        }
    }
    return false
}

export const logout = async()=>{
    try{
        await axios.post(LOGOUT_URL,
            {},
            {withCredentials:true}
        )
        return true
    }
    catch(error){
        console.log(error)
        return false
    }
}


export const is_authenticated = async() =>{
    try{
        await axios.post(AUTH_URL, {} , {withCredentials:true}, 
        )
        return true
    }
    catch(error){
        console.log(error)
        return false
    }
}
