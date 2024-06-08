import { users } from "../database/db"

function authUser(request, response, next) {
    
    const email = request.params.email

    if (!email) {
        return response.status(401).json({
            success: false,
            message: "Não autorizado! Você não está logado."
        })
    }

    const userFound = users.find(user => user.email === email)

    if (!userFound) {
        return response.status(401).json({
            success: false,
            message: "Credenciais inválidas!"
        })
    }

    request.user = userFound    
    return next()
}

export default authUser