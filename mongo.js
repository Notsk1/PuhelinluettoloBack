const mongoose = require('mongoose')

if (process.argv.length<=3) {
    var tulosta = true
}
  
const password = process.argv[2]
const nimi = process.argv[3]
const numero = process.argv[4]

const url = `mongodb+srv://peteboi:${password}@luettolo.pnl2i.mongodb.net/Phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const phoneSchema = new mongoose.Schema({
        name: String,
        number: String,
        id: Number,
})
const Phone = mongoose.model('Phone', phoneSchema)
const generateId = () => {
    return Math.floor(Math.random()*10000)
}

if(tulosta){
    Phone.find({}).then(result => {
        result.forEach(phone => {
          console.log(phone.name,phone.number)
        })
        mongoose.connection.close()
      })
}
else{
    var ids = generateId()
    console.log(ids)
    const phone = new Phone({
        name: nimi,
        number: numero,
        id:ids ,
    })

    phone.save().then(result => {
        console.log('phone saved!')
        mongoose.connection.close()
      })
}
