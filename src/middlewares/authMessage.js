import { messages } from "../database/db"

function authMessage(request, response, next) {
    
    const id = request.params.id
    const verifyIndex = messages.findIndex((message) => message.id === id)

    if (verifyIndex === -1) {
        return response.status(404).json({
            success: false,
            message: "Recado não encontrado!"
        })
    }

    const message = messages[verifyIndex]

    if (message.userId !== user.id) {
        return response.status(403).json({
            success: false,
            message: "Você não tem permissão para editar este recado!"
        })
    }

    request.verifyIndex = verifyIndex
    return next()
}

export default authMessage