var fajar, zuhr, asar, maghrib, isha;

// const { application } = require('express')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const axios = require('axios');
const schedule = require('node-schedule');
const cron = require('node-cron')

const app = express()
app.use(cors())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");

    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-with, Content-Type, Accept"
    );
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    next();
});

app.use(express.json())
mongoose.connect('mongodb+srv://saadkhan:saadkhan@cluster0.fquu7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority').then(() => console.log("connection succesfull")).catch((error) => console.log(error))

const registeredCities = mongoose.model('Registered Cities', {
    cityName: {
        type: String,
        required: true
    }
})
const registeredUser = mongoose.model('Registered User', {
    cityName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
})

app.post('/registerUser', async (req, res) => {
    const { cityName, userName, email } = req.body
    console.log(cityName, userName, email)
    if (!email, !userName, !cityName) {
        return (res.status(500).send("plz fill all fields")
        )
    }
    else {
        const userExist = await registeredUser.findOne({ email })
        if (userExist) {
            console.log("exsists")

            return (res.status(400).send("User already exsists"))

        } else {

            const table = new registeredUser({ cityName, userName, email })
            table.save().then(async () => {
                const cityExist = await registeredCities.findOne({ cityName })
                if (cityExist) {
                    console.log("exsists")

                    return (res.status(400).send("City already exsists"))

                } else {

                    const table = new registeredCities({ cityName })
                    table.save().then(async () => {
                        await axios.get(`https://api.pray.zone/v2/times/today.json?city=${cityName}&juristic=1&school=1&timeformat=0`).then(resp => {
                            fajar = resp.data.results.datetime[0].times.Fajr
                            zuhr = resp.data.results.datetime[0].times.Dhuhr
                            asar = resp.data.results.datetime[0].times.Asr
                            maghrib = resp.data.results.datetime[0].times.Maghrib
                            isha = resp.data.results.datetime[0].times.Isha
                        });
                        if (fajar) {
                            cron.schedule(`1 ${fajar.substr(3, 5)} ${fajar.substr(0, 2)} * * *`, () => {
                                console.log(fajar.substr(0, 2))
                                console.log(fajar.substr(3, 5))
                            })
                        }
                        if (zuhr) {
                            cron.schedule(`1 ${zuhr.substr(3, 5)} ${zuhr.substr(0, 2)} * * *`, () => {
                                console.log(zuhr.substr(0, 2))
                                console.log(zuhr.substr(3, 5))
                            })
                        }
                        if (asar) {
                            cron.schedule(`1 ${asar.substr(3, 5)} ${asar.substr(0, 2)} * * *`, () => {
                                console.log(asar.substr(0, 2))
                                console.log(asar.substr(3, 5))
                            })
                        }
                        if (maghrib) {
                            cron.schedule(`1 ${maghrib.substr(3, 5)} ${maghrib.substr(0, 2)} * * *`, () => {
                                console.log(maghrib.substr(0, 2))
                                console.log(maghrib.substr(3, 5))
                            })
                        }
                        if (isha) {
                            cron.schedule(`1 ${isha.substr(3, 5)} ${isha.substr(0, 2)} * * *`, () => {
                                console.log(isha.substr(0, 2))
                                console.log(isha.substr(3, 5))
                            })
                        }
                        
                        console.log("City registered successfully"); res.status(200).send('City registered successfully')
                    }).catch((error) => { console.log(error) })
                }
                console.log("City registered successfully"); res.status(200).send('City registered successfully')
            }).catch((error) => { console.log(error) })
        }
    }
})







cron.schedule('59 23 * * *', async () => {
// console.log("asad")
    const documents = (await registeredCities.find()).forEach(async (item) => {
        console.log(item.cityName)
        await axios.get(`https://api.pray.zone/v2/times/today.json?city=${item.cityName}&juristic=1&school=1&timeformat=0`).then(resp => {
            fajar = resp.data.results.datetime[0].times.Fajr
            zuhr = resp.data.results.datetime[0].times.Dhuhr
            asar = resp.data.results.datetime[0].times.Asr
            maghrib = resp.data.results.datetime[0].times.Maghrib
            isha = resp.data.results.datetime[0].times.Isha
        });
        // fajar="23:25"

        if (fajar) {
            cron.schedule(`1 ${fajar.substr(3, 5)} ${fajar.substr(0, 2)} * * *`, () => {
                console.log(fajar.substr(0, 2))
                console.log(fajar.substr(3, 5))
            })
        }
        if (zuhr) {
            cron.schedule(`1 ${zuhr.substr(3, 5)} ${zuhr.substr(0, 2)} * * *`, () => {
                console.log(zuhr.substr(0, 2))
                console.log(zuhr.substr(3, 5))
            })
        }
        if (asar) {
            cron.schedule(`1 ${asar.substr(3, 5)} ${asar.substr(0, 2)} * * *`, () => {
                console.log(asar.substr(0, 2))
                console.log(asar.substr(3, 5))
            })
        }
        if (maghrib) {
            cron.schedule(`1 ${maghrib.substr(3, 5)} ${maghrib.substr(0, 2)} * * *`, () => {
                console.log(maghrib.substr(0, 2))
                console.log(maghrib.substr(3, 5))
            })
        }
        if (isha) {
            cron.schedule(`1 ${isha.substr(3, 5)} ${isha.substr(0, 2)} * * *`, () => {
                console.log(isha.substr(0, 2))
                console.log(isha.substr(3, 5))
            })
        }
        

    })
});


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`server is running on ${PORT}`))