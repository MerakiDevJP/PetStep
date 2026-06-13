require('dotenv').config();
const mongoose = require('mongoose');
const Pet = require('./models/pet.model');

const fotos = {
  'Luna':   'https://www.farmaciasanbernardo.mx/cdn/shop/articles/puppy-dog-red-mammal-curiosity-vertebrate-730900-pxhere.com.jpg?v=1723826295',
  'Ragnar': 'https://nupec.com/wp-content/uploads/2021/08/Captura-de-Pantalla-2021-08-02-a-las-13.34.30.png'
  // agrega más si tienes más mascotas
};

mongoose.connect(process.env.MONGO_URI).then(async () => {
    for (const [nombre, url] of Object.entries(fotos)) {
        const resultado = await Pet.updateOne(
            { name: nombre },
            { $set: { fotoUrl: url } }
        );
        console.log(`${nombre}: ${resultado.modifiedCount ? '✅ actualizado' : '⚠️ no encontrado'}`);
    }
    console.log('Migración completa');
    process.exit(0);
}).catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});