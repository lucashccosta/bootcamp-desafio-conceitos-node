const { isUuid } = require("uuidv4");

const middlewares = {
    validateId(request, response, next) {
        const { id } = request.params;
    
        if(!isUuid(id)) {
            return response.status(400).json({ error: 'Invalid repository ID' });
        }
        
        return next();
    },

    existsId(payload) {
        return (request, response, next) => {
            const { id } = request.params;

            const index = payload.findIndex(data => data.id === id);
            if(index < 0) {
                return response.status(400).json({ error: 'Repository Not Found'});
            }

            request.repoIndex = index;
            
            return next();
        }
    }
}

module.exports = middlewares;