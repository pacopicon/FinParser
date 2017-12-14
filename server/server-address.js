require('dotenv').config({ path: 'variables.env' }); 

export default const address = `localhost:${process.env.PORT}`
