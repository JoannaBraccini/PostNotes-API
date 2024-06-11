import { messages } from "../database/db"

function authMessage(request, response, next) {
    
    const noteId = String(request.params.id)
    const verifyIndex = messages.findIndex(message => message.id === noteId)
    const message = messages.find(message => message.id === noteId)

    if (verifyIndex === -1) {
        return response.status(404).json({
            success: false,
            message: "Recado não encontrado!"
        })
    }

    request.verifyIndex = verifyIndex
    request.message = message
    return next()
}

export default authMessage