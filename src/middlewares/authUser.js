import { users } from "../database/db"


function authUser(request, response, next) {

    const userId = request.headers.authorization

    if (!userId) {
        return response.status(401).json({
            success: false,
            message: "Credenciais inválidas!"
        })
    }

    const userFound = users.find(user => user.id === userId)

    if (!userFound) {
        return response.status(401).json({
            success: false,
            message: "Não autorizado! Você não está logado."
        })

    }
    
    request.userId = userId
    return next()
}

export default authUser