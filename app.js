// const cluster = require('cluster');
// const cpus = require('node:os')
const http = require('http');
const express = require('express');
const bycrpt = require('bcryptjs');
const mongoose = require('mongoose');
const moment = require('moment');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const compression = require('compression');
const sharp = require('sharp');
const Cookie = require("cookie");

const userModel = require('./models/Account');
const profilePics = require('./models/UserPics');
const joinedUsers = require('./models/joinedUsers');
const userPreference = require('./models/userPreference');
const userFeedBacks = require('./models/Feedback'); 
const myTrip = require('./models/userTrip'); 
const postCont = require("./models/PostContent");
const { __processMessage } = require('./utils/socket/requestProcession');
const { __processReceiverConfirmation } = require('./utils/socket/processReceiverConfirmation');
const { sendToSender } = require('./utils/socket/sendToSender');
const { sendToReceiver } = require('./utils/socket/sendToReceiver');
const { processDisconnectedUser } = require('./utils/socket/processDisconnection');
const { processConnectedUser } = require('./utils/socket/processConnectedUser');
const { processChatMessages } = require('./utils/socket/processChatMessages');
const { processMapEvent } = require('./utils/socket/processMapEvent');

const {db, eEmitter} = require("./models/Ps_Number");
const {sanitizeMe} = require("./public/js/regexInputValues");
const { cookie: checkPoint } = require("./utils/computation/checkPoint");
const { __processPSMessage } = require('./utils/socket/psNumberReqProcession');
const { _id } = require('./.env/keys')

// console.log(all)
// Clustering 
// if (cluster.isMaster) {
//     console.clear();
//     console.log("Master process", + process.pid);

//     // forking
//     for (let i = 0; i < cpus; i++) {
//         cluster.fork();
//     }

//     // spawning another when exit
//     cluster.on("exit", (x, y, z) => {
//         console.log("Worker " + x, " ", y, " ", z + " died============");
//         cluster.fork();
//     });

// } else {

    const app = express();
    const server = http.createServer(app, {
        cors: {
            origin: "http://localhost:3000",
            Credential: true
        }
    });

    // Socket.IO
    const socketIO = require('socket.io')(server);

    // Instantiating the checkPoint Class
    const CheckPoint = new checkPoint();

    // mongoose db connection
    const mongoURI = "mongodb://localhost:27017/WebG";
    mongoose.connect(mongoURI)
    .then(() => {
        return;
    })
    
     //  Variables
     var checkImgSender, filename;

    //  User Image Storing and Processing Using Multer
    const storage = multer.diskStorage({
        destination: async (req, file, callback) => {
            const device = req.headers['user-agent'];
            const reqCookie = req.headers.cookie;
            checkImgSender = await CheckPoint.parseCookie(Cookie, reqCookie, device);

            if (checkImgSender.cookie && checkImgSender.phone_no) {
                callback(null, 'UserProfilePictures');
            } else {
                callback(null, 'UnAuthenticatedImages');
            }

        },
        filename: (req, file, callback) => {
            if (checkImgSender.cookie && checkImgSender.phone_no) {
                filename = Date.now() + path.extname(file.originalname);
                callback(null, filename);

            } else {
                let filename = "trash.png";
                callback(null, filename);
                return idle(true, `UnAuthenticatedImages/${filename}`);
            }
        },
    });

    // Uploader variable map to app post route ('/UserImg')
    var maxSize = 1.51 * 1024 * 1024;   // 1.51MB allowed or less than
    const upload = multer({
        storage: storage,
        limits: { fileSize: maxSize }
    }); 
    
    // middlewares
    app.use(compression({
        level: 6,
        threshold: 10 * 1000,
        filter: (req, res) => {
            if (req.headers['x-no-compression']) {
                return false;
            }
            return compression.filter(req, res);
        }
    }));
    
    // app.use(function(req, res, next) {
    //     res.set({
    //         'Access-Control-Allow-Origin': 'http://localhost:3000',
    //         'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    //         'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    //     });
    //     next();
    // })
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());
    
    // static file
    app.use(express.static('/public/'));
    app.use('/css', express.static(__dirname + '/public/css'));
    app.use('/img', express.static(__dirname + '/public/img'));
    app.use('/js', express.static(__dirname + '/public/js'));
    app.use('/leaflet.markercluster', express.static(__dirname + '/public/plugins/leaflet.markercluster'));
    app.use('/leaflet-routing-machine', express.static(__dirname + '/public/plugins/leaflet-routing-machine'));
    
    // set views 
    app.set('views', './views');
    app.set('view engine', 'ejs');
    
    // homePage page
    app.get('/WebG/Home/', async (req, res) => {
        const device = req.headers['user-agent'];
        const reqCookie = req.headers.cookie;

        if(reqCookie) {
            const parseCookie = await CheckPoint.parseCookie(Cookie, reqCookie, device);
            
            if (parseCookie.username && parseCookie.phone_no) {
                socketIO.once('connection', async (socket) => {   // ================================= SOCKET CONNECTION =================================
                    var phoneNumber = parseCookie.phone_no;
                    var userName = parseCookie.username;
                    var _ID = socket.id;
                    processConnectedUser(phoneNumber, userName, socket, socketIO);
                    // Notice to Browser that all is ok
                    send(_ID, 'logging_Okay', { ok: true, username: parseCookie.username, phoneNo: parseCookie.phone_no });
                    socket.on('update', async (msg) => {
                        if (msg.getTripRec) {
                            const _myTrip = await myTrip.findOne({ phone_no: phoneNumber });
                            if (_myTrip) {
                                const data = formatTripData(_myTrip);
                                send(_ID, 'hasRecord', data);
                            } else {
                                send(_ID, 'hasRecord', 'No record');
                            }

                        } else {
                            try{
                                let existingUser = await joinedUsers.findOne({phone_no: phoneNumber});
                                if (existingUser.myPreference.length !== 0) {
                                    existingUser.myPreference.forEach((e, index) => {
                                        e !== null && e.length === 4 ? [e.push('sent'),
                                        send(_ID, 'notifie', { notifie: e, index: index })
                                    ] : '';
                                    });
                                    await existingUser.save();
                                }
                            } catch(err) {
                                send(_ID, 'warning', 'Something went wrong');
                            }
                        }
                    });

                    socket.on('delNotifie', async (msg) => {
                        try{
                            let senderPref_ = await joinedUsers.findOne({ phone_no: phoneNumber });
                            if (senderPref_) {
                                senderPref_.myPreference[msg] = null;
                                senderPref_.myPreference = senderPref_.myPreference.filter(e => e !== null);
                                await senderPref_.save();
                            }
                        } catch (err) {
                            send(_ID, 'warning', 'Something went wrong');
                            return false;
                        }
                    });
                    
                    //  Listening the request msg from Client
                    await socket.on('requestConnection', (message) => {
                        __processMessage(socketIO, socket, phoneNumber, message, _ID); //  processes the msg then send it to receiver
                    });
                    
                    //  Listening the request msg from Client using PS Number
                    await socket.on('psNumberRequestConnection', (ps) => {
                        __processPSMessage(socketIO, socket, phoneNumber, ps, _ID); //  processes the msg then send it to receiver
                    });
                    
                    // sending request to client that you wanna connect him and share loc..
                    await socket.on('confirm-to-share', (msg) => {
                        let message = msg.message
                        __processReceiverConfirmation(socketIO, message, msg.res);
                    });
                
                    // ... Sending Data To Sender
                    socket.on('send-to-sender', (msg) => {
                        sendToSender(socketIO, msg);     
                    });
                
                    // ... Sending Data To Receiver
                    socket.on('send-to-receiver', (msg) => {
                        sendToReceiver(socketIO, msg);    
                    });

                    // Map Interaction Using Indicators
                    await socket.on('mapClick', (msg) => {  
                        if (msg.type === 'indicators') {
                            let mssg = formatMessage(msg);
                            processMapEvent(socketIO, phoneNumber, 'mapIndicators', mssg);
                        }
                    });

                    socket.on('record', async (coords) => {
                        const data = {
                            name: userName,
                            coords: coords.firstFeet || coords.nextFeet || coords.lastFeet,
                            },
                            checkTripRound = await myTrip.findOne({ phone_no: phoneNumber });

                        if (checkTripRound) {
                            switch (coords.step) {
                                case 'initial':
                                    try{
                                        await myTrip.findOneAndUpdate(
                                        { phone_no: phoneNumber },
                                        {
                                            eventDate: coords.eventDate,
                                            initTime: coords.initTime,
                                            data: data,
                                            endTime: null
                                        },
                                        { new: true }
                                    )
                                    } catch (err) {
                                        send(_ID, 'warning', { rec: 'Something went wrong' });
                                    }
                                    break;
                                    case 'end':
                                    checkTripRound.data.push(data);
                                    checkTripRound.endTime = coords.endTime;
                                    await checkTripRound.save();
                                    break;
                                default:
                                    try{
                                        checkTripRound.data.push(data);
                                        await checkTripRound.save();

                                    } catch (err) {
                                        send(_ID, 'warning', { rec: 'Something went wrong' });
                                    }
                                    break;
                                }

                            } else {
                            try{
                                let trip = new myTrip({ 
                                    phone_no: phoneNumber,
                                    eventDate: coords.eventDate,
                                    initTime: coords.initTime,
                                    endTime: null,
                                    data: data
                                });
                                await trip.save();
                            } catch(err) {
                                send(_ID, 'warning', { rec: 'Something went wrong' });
                            }
                        }
                        
                    });
                    
                    socket.on('delTrip', async () => {
                        await myTrip.findOneAndDelete({ phone_no: phoneNumber });
                    });

                    socket.on('onPsRequestCoords', (coords) => {
                        send(coords[0], 'closeWatch', coords[1]);
                    });
                    
                    socket.on('visualAid', async (coords) => { 
                        let coordsFormat = {
                            route: coords.route,
                            lat: coords.coords.x,
                            lng: coords.coords.y
                        }
                        processMapEvent(socketIO, phoneNumber, 'illustration', coordsFormat);
                    });

                    await socket.on("chat", (msg) => {
                        processChatMessages(socketIO, phoneNumber, msg);
                    });
                
                    // WEBRTC STUFF ===============================================================
                    socket.on('offer', (offer) => {
                        console.log(offer)
                    });

                    socket.on('answer', (ans) => {
                        console.log(ans)
                    });
                
                    socket.on('iceCandidate', (iceC) => {
                        console.log(iceC)
                    });

                    socket.on('error', err => console.log(err))
                    
                    await socket.on('disconnect', async () => {
                        var x = 'unset';
                        try{
                            await joinedUsers.findOneAndUpdate({ id: socket.id },
                                {
                                    outTime: moment().format('MMMM Do YYYY, h:mm:ss a'),
                                    routeOne: x,
                                    connectedUserRouteOne: x,
                                    routeTwo: x,
                                    connectedUserRouteTwo: x,
                                    routeThree: x,
                                    connectedUserRouteThree: x,
                                    online: false
                                });
                                
                            } catch (err) {
                                return false;
                        }
                        // processDisconnectedUser(socketIO, socket);
                    });
                    
                    function send(id, event, msg) {  
                        socketIO.sockets.to(id).emit(event, msg);
                    }

                    function formatMessage(task) {
                        return {
                            route: task.route, 
                            click: task.click,
                            isCustom: task.isCustom,
                            ondrag: task.ondrag,
                            icon: task.icon, 
                            img: task.img,
                            text: task.text,
                            coords: task.coords
                        }
                    }
                    
                    function formatTripData(arg) {
                        return {
                            date: arg.eventDate,
                            initTime: arg.initTime,
                            endTime: arg.endTime,
                            data: arg.data
                        }
                    }
                    
                });

            } else if (parseCookie.update) {
                socketIO.once('connection', (socket) => {
                    socketIO.sockets.to(socket.id).emit('unknownUser', { update: true });
                });
            
            } else if (parseCookie.logOut) {
                socketIO.once('connection', (socket) => {
                    socketIO.sockets.to(socket.id).emit('unknownUser', { logOut: true });
                });
            
            } else {
                socketIO.once('connection', (socket) => {
                    socketIO.sockets.to(socket.id).emit('unknownUser', { unknownUser: true });
                });
            }

        } else {
            // console.log(reqCookie)
            socketIO.once('connection', (socket) => {
                socketIO.sockets.to(socket.id).emit('unknownUser', { welcomeUser: true });
            });
        }

        res.render('Home'); //Preview Home Page;
        return res.end();
        
    });
    
    //  Sign Up Route
    app.get('/WebG/Sign-Up', (req, res) => {
        res.render('SignUp');
        res.end();
    });
    
    app.post('/WebG/Sign-Up', async (req, res) => {
        const device = req.headers['user-agent'];
        const { first_name, last_name, phone_no, password, 
            age, gender, state, town, date } = req.body;
            
        if (first_name && last_name && phone_no && password && age && gender) {
            let checkExistingUser = await userModel.findOne({phone_no: phone_no});
            if (checkExistingUser) {
                return res.json({reg: 'This phone number is been Registered!'});
    
            } else {
                const myPsNo = new db();    // Instantiation the Ps-Number db class
                await myPsNo.insert(phone_no);

                eEmitter.once("psNoInfo", async (msg) => { 
                    if (msg.userPsNo) {
                        const resCookie = CheckPoint.createCookie(device);
                        try {
                            //  Storing User data
                            const hashPWD = await bycrpt.hash(password, 12);    // Hashing the password.....
                            let storeUserData = new userModel({
                                id: resCookie.userCookie._ck_,
                                first_Name: first_name,
                                last_Name: last_name,
                                phone_no: phone_no, 
                                password: hashPWD,
                                dateOfBirth: age,
                                gender: gender,
                                state: state,
                                town: town,
                                device: device,
                                status_id:'__Default',
                                time: date
                            });
                            await storeUserData.save();

                            res.setHeader('Set-Cookie', Cookie.serialize("credentials", JSON.stringify(resCookie.userCookie), resCookie.cookieOptions));
                            return res.json({ userPsNo: msg.userPsNo });
                            
                        } catch (error) {
                            res.json({ psNo_1: "Error while processing your information, please try again." });
                        }
                        
                    } else {
                        return res.json({ psNo_1: msg }); 

                    }
                    
                });
        
            }
    
         } else {
            return res.json({
                redirect: true
            });
        }
    
    });
    
    // LogIn page
    app.get('/WebG/LogIn', async (req, res) => {
        res.render('LogIn');
        res.end();
    
    });
    app.post('/WebG/logIn', async (req, res) => {
        const device = req.headers['user-agent'];
        const reqCookie = req.headers.cookie;
        const {phone_no, password, psNo} = req.body;
        
        if (psNo) {
            if (psNo !== '') {
                // Checking the psNo before passing 
                const realPsNo = sanitizeMe(psNo);
                if (realPsNo.status !== "invalid") {
    
                    // Checking the Existing psNo in db
                    let myPsNo = new db()
                    myPsNo.checksExistingPsNo(psNo);
                    eEmitter.once("Access-Info", async (msg) => {
                        if (msg.status !== false && msg.phone_no !== undefined) {
                            //  cookie Updating
                            const resCookie = CheckPoint.createCookie(device, true);
                            
                            const cookieUpdate = resCookie.userCookie._ck_,
                            logged = resCookie.userCookie._st_;
                            try {
            
                                await userModel.findOneAndUpdate(
                                    {phone_no: msg.phone_no},
                                    {id: cookieUpdate, device: device, status_id: logged},
                                    {new: true}
                                );
                                res.setHeader('Set-Cookie', Cookie.serialize("credentials", JSON.stringify(resCookie.userCookie), resCookie.cookieOptions));
                                return res.json({permit: true}); 

                            } catch(err) {
                                return res.json({psNoErr: "Something Went Wrong!"});
                            }
            
                        } else {
                            return res.json({psNoErr: msg.msg});

                        }
        
                    });
    
                } else {
                    return res.json({psNoErr: "Incorrect Ps-Number!"});
    
                }
    
            } else {
                return res.json({psNoErr: "Error Gotten Please Try Again...!"}); 
            }
    
        } else {
            if (phone_no !== '' && password !== '') {
                if (reqCookie) {
                    const parseCookie = await CheckPoint.parseCookie(Cookie, reqCookie, device);
                    if (parseCookie.cookie || parseCookie.update || parseCookie.err || parseCookie.logOut) {
                        // Update Cookie,  checks Existing User and do some Verification 
                        const cookieUpdate = await CheckPoint.updateCookie(phone_no, password, device, true);
                        if (cookieUpdate.AccountErr) {
                            if (cookieUpdate.AccountErr.phoneNoErr) {
                                return res.json({phoneNoErr: "Sorry! the phone number is not registered"});

                            } else if (cookieUpdate.AccountErr.pwdErr) {
                                return res.json({pwdErr: "The password isn't match!"}); 

                            } else if (cookieUpdate.AccountErr.dvc) {
                                //Ask User Whetheror he wanna opt out from other device or not
                                res.json({Double: "Device"}); 
                                return res.end();
                
                            } 

                        } else {
                            res.setHeader('Set-Cookie', Cookie.serialize("credentials", JSON.stringify(cookieUpdate.updated.userCookie), cookieUpdate.updated.cookieOptions));
                            res.json({permit: true}); 
                            return res.end();   
                        }
                
                    } else if (parseCookie.parseErr) {
                         //  Re-Update Cookie in case it got edited
                         const cookieUpdate = await CheckPoint.updateCookie(phone_no, password, device, true);
                         res.setHeader('Set-Cookie', Cookie.serialize("credentials", JSON.stringify(cookieUpdate.updated.userCookie), cookieUpdate.updated.cookieOptions));
                         res.json({permit: true}); 
                         return res.end(); 
                    }
    
                } else {
                    // Update Cookie in case it got deleted by the user himself
                    const cookieUpdate = await CheckPoint.updateCookie(phone_no, password, device, true);
                    if (cookieUpdate.AccountErr) {
                        if (cookieUpdate.AccountErr.phoneNoErr) {
                            return res.json({phoneNoErr: "Sorry! the phone number is not registered"});

                        } else if (cookieUpdate.AccountErr.pwdErr) {
                            return res.json({pwdErr: "The password isn't match!"}); 

                        } else if (cookieUpdate.AccountErr.dvc) {
                                //Ask User Whetheror he wanna opt out from other device or not
                                res.json({Double: "Device"}); 
                                return res.end();
                
                            } 

                    } else {
                        res.setHeader('Set-Cookie', Cookie.serialize("credentials", JSON.stringify(cookieUpdate.updated.userCookie), cookieUpdate.updated.cookieOptions));
                        res.json({permit: true}); 
                        return res.end();   
                    }
                    
                }
    
            } else {
                res.json({404: '404'});
                return res.end();
            }

        }
    
    }); 

    app.post('/WebG/UserConsent', async (req, res) => {
        const referer = req.headers['referer'];
        const fetchSite = req.headers['sec-fetch-site'];
        const device = req.headers['user-agent'];
        const { respond, phone_no, password } = req.body;

        if (referer !== undefined && fetchSite !== 'none') {
            if (respond === "SignOut") {
                const cookieUpdate = await CheckPoint.updateCookie(phone_no, password, device, true, false);
                res.setHeader('Set-Cookie', Cookie.serialize("credentials", JSON.stringify(cookieUpdate.updated.userCookie), cookieUpdate.updated.cookieOptions));
                res.json({ permit: true }); 
                return res.end();

            } else if (respond === "Remain") {
                const cookieUpdate = await CheckPoint.updateCookie(phone_no, password, device, true, true);
                res.setHeader('Set-Cookie', Cookie.serialize("credentials", JSON.stringify(cookieUpdate.updated.userCookie), cookieUpdate.updated.cookieOptions));
                res.json({ permit: true }); 
                return res.end();  
            }

        } else {
            return res.status(404).send('Not Found');
        }

    });
    
    app.get('/WebG/image/:name', async (req, res) => {
        //  Check which browser made a GET req if 'sec-fetch-site' == same-origin and has property of cookie, so grand access
        const referer = req.headers['referer'];
        const fetchSite = req.headers['sec-fetch-site'];

        if (referer !== undefined && fetchSite !== 'none') {
            //  Check cookie before providing the Image data
            const value = req.params.name;
            const imgCookie = req.headers.cookie
            
            if (imgCookie) {
                let imgCookieParseStep_1 = Cookie.parse(imgCookie),
                imgCookieParseStep_2 = JSON.parse(imgCookieParseStep_1.credentials),
                imgCookie_ck = imgCookieParseStep_2._ck_,
                imgCookie_st = imgCookieParseStep_2._st_;

                if (value === "self" && imgCookie_st !== '0') {
                    const user = await userModel.findOne({id: imgCookie_ck});

                    if (user) {
                        let image = await profilePics.findOne({phone_no: user.phone_no});

                        if (!image) {
                            defaultProfileImgPic(res);

                        } else {
                            res.set('Content-Type', image.contentType); 
                            return res.send(image.data);  
        
                        }
            
                    } else {
                        defaultProfileImgPic(res);
                    }
            
                } else if (value !== "self" && imgCookie_st !== '0') {
                    const user = await userModel.findOne({id: imgCookie_ck});
                    if (user) {
                        let image = await profilePics.findOne({phone_no: value});
        
                        if (!image) {   
                            defaultProfileImgPic(res);
        
                        } else {
                            res.set('Content-Type', image.contentType);
                            return res.send(image.data); 
                            
                        }
                        
                    } else {
                        defaultProfileImgPic(res);
                    }
                    
                } else {
                    defaultProfileImgPic(res);
                }
                
            } else {
                defaultProfileImgPic(res);
            }
            
        } else {
            res.sendStatus(404);
            res.end();
        }
    
    });

    function defaultProfileImgPic(res) {
        try {
            fs.readFile("./WebGResources/default_user_picture.png", (err, data) => {
                if (err) {
                    setTimeout(() => defaultProfileImgPic(), 2000);
                    return;

                } else {
                    res.set('Content-Type', 'image/jpg');
                    return res.send(data);

                }
            });
        } catch (err) {
            return false;
        }
    }
    
    // User Profile Img Collection.....
    app.post('/WebG/upload_Profile_Image', upload.single('imgFile'), async (req, res, next) => {
        
        // Check the file not Empty
        const file = req.file;
        if (file) {
            //  Check Cookie
            const device = req.headers['user-agent'];
            const reqCookie = req.headers.cookie;
            if (req.headers['sec-fetch-site'] !== 'none' && reqCookie) {
                let parseCookie = await CheckPoint.parseCookie(Cookie, reqCookie, device);

                if (parseCookie.cookie) {
                    //  reading the img
                    let imageFile;
                    let imageBinary;
                    try {
                        imageFile = fs.readFileSync(file.path);    
    
                        //  resizing the Img to width 150 pixels and of height 200 pixels
                        await sharp(imageFile).resize(150, 200).jpeg().toFile(file.path);
                        imageBinary = await sharp(imageFile).resize(150, 200).jpeg().toBuffer();
    
                    } catch (error) {
                        return next('Image Processing Error!');
                    }

                    const check_has_user_ever_upload_img = await profilePics.findOne({ phone_no: parseCookie.phone_no });
                    if (check_has_user_ever_upload_img) {
                        await profilePics.findOneAndUpdate(
                            { phone_no: parseCookie.phone_no },
                            { imgName: filename, 
                            data: imageBinary,
                            contentType: file.mimetype, 
                            time: moment().format('MMMM Do YYYY, h:mm:ss a') }, 
                            { new: true });

                            idle(true, `UserProfilePictures/${check_has_user_ever_upload_img.imgName}`); // Delete the previous pic if user update the profile picture

                    } else {
                        const profilePic = new profilePics({
                            phone_no: parseCookie.phone_no,
                            imgName: filename, 
                            data: imageBinary,
                            contentType: file.mimetype, 
                            time: moment().format('MMMM Do YYYY, h:mm:ss a')
                        });
                        await profilePic.save();

                    }
    
                    setTimeout(() => {
                        res.json({ redirect: true });
                        return res.end();
                    }, 900);
                        
                } else {

                    return res.json({ redirect: true });

                    }

            } else {

                return res.json({ redirect: true });

                }
                
        } else {
    
            return res.json({ redirect: true }); 
    
        }
    
    });
    
    app.get("/WebG/FeedBack", async (req, res) => {
        const device = req.headers['user-agent'];
        const reqCookie = req.headers.cookie;
        
        if (req.headers['sec-fetch-site'] !== 'none' && reqCookie || reqCookie) {
            const parseCookie = await CheckPoint.parseCookie(Cookie, reqCookie, device);
            if (parseCookie.username && parseCookie.phone_no) {
// ================================= SOCKET CONNECTION =================================
                socketIO.once('connection', async (socket) => {
                    // const DAYs = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    var UserName = parseCookie.username;
                    var phoneNumber = parseCookie.phone_no;
                    var id = socket.id;

                    try {
                        let fdb = await userFeedBacks.find({ id: _id });
                        if (fdb.length !== 0) {
                            fdb.forEach((e, f) => {
                                // let date = new Date(e.createdAt);
                                // let day = DAYs[date.getDay()];
                                if (f <= 50) {
                                    socket.emit('feedback', { data: e.comments, view: e.viewed});
                                }
                            });

                        }
                        
                    } catch (err) {
                        return false;
                    }

                    socket.on('myFeed', async (msg) => {
                        let content = {
                            phoneNo: phoneNumber,
                            username: UserName,
                            comment: msg.comment,
                            time: msg.time[0],
                            date: msg.time[1]
                        }
                        let comment = await userFeedBacks({ comments: content });
                        await comment.save();
                        socket.emit('feedback', { data: content });
                        socket.broadcast.emit('feedback', { data: content });
                    });

                });

                res.render("FeedBack");
                res.end();

            } else {
                return res.redirect('Home');

            }
            
        } else {
            return res.redirect('LogIn');

        }

    });

    app.get("/WebG/Account-Setting", (req, res) => {
        res.render("Account-Setting");
        res.end();
    });

    app.get("/WebG/Close-Watch", async (req, res) => {
        const device = req.headers['user-agent'];
        const reqCookie = req.headers.cookie;
        
        if (req.headers['sec-fetch-site'] !== 'none' && reqCookie || reqCookie) {
            const parseCookie = await CheckPoint.parseCookie(Cookie, reqCookie, device);
            if (parseCookie.username && parseCookie.phone_no) {
// ================================= SOCKET CONNECTION =================================
                socketIO.once('connection', async (socket) => {
                    var UserName = parseCookie.username;
                    var phoneNumber = parseCookie.phone_no;
                    var id = socket.id;
                    let checkExistingUser = await userPreference.findOne({ phone_no: phoneNumber });
                    if (checkExistingUser) {
                        let retrieveData = formatRetrieData(checkExistingUser);
                        let vecantIndex = formatRetrieData(checkExistingUser, true);
                        send(id, 'retrieveData', [retrieveData, vecantIndex, { myNumber: phoneNumber }]);
                        
                    } else {
                        try {
                            let saveCloseWatchNumber = new userPreference({
                                phone_no: phoneNumber
                            });
                            
                            await saveCloseWatchNumber.save();
                            send(id, 'watch', { myNumber: phoneNumber });
                            
                        } catch (err) {
                            return;
                        }
                        
                    }
                    
                    socket.on('closeWatch', async (msg) => {
                        let phoneNoOwner = await userModel.findOne({ phone_no: msg.phoneNo });
                            
                        const userName = phoneNoOwner ? phoneNoOwner.first_Name : 'unknown';

                        if (msg.mode === 'add') {
                            processCloseWatch(msg, phoneNumber, userName, UserName);
                            
                        } else if (msg.mode === 'edit') {
                            processCloseWatch(msg, phoneNumber, userName, UserName);
                            
                        } else if (msg.mode === 'delete') {
                            processCloseWatch(msg, phoneNumber, userName);

                        }

                        send(id, 'watch', {
                            row: msg.row,
                            name: msg.mode === 'delete' ? "" : userName,
                            action: ''
                        });
                        
                    });

                    async function processCloseWatch(msg, phoneNumber, phoneNo_Owner, sender) {
                        let Content = msg.mode === 'delete' ? [] : [msg.row, msg.phoneNo, phoneNo_Owner];
                        let _Content = [sender, phoneNumber, msg.eventTime, msg.eventDate];
                        let knownNumber = phoneNo_Owner !== 'unknown' ? msg.phoneNo : null;

                        if (msg.row === '1') {
                            await userPreference.findOneAndUpdate(
                                { phone_no: phoneNumber },
                                { closeWatch_1: Content },
                                { new: true }
                            );
                            
                        } else if (msg.row === '2') {
                            await userPreference.findOneAndUpdate(
                                { phone_no: phoneNumber },
                                { closeWatch_2: Content },
                                { new: true }
                            );
                            
                        } else if (msg.row === '3') {
                            await userPreference.findOneAndUpdate(
                                { phone_no: phoneNumber },
                                { closeWatch_3: Content },
                                { new: true }
                            );
                            
                        } else if (msg.row === '4') {
                            await userPreference.findOneAndUpdate(
                                { phone_no: phoneNumber },
                                { closeWatch_4: Content },
                                { new: true }
                            );
                            
                        }

                        if (knownNumber && sender) {
                            try{
                                let xyz = await joinedUsers.findOne({ phone_no: knownNumber });
                                xyz.myPreference.push(_Content);
                                await xyz.save();
                                send(xyz.id, 'notifie', { new: true });
                                
                            } catch(err) {
                                socket.emit('warn', 'Something went wrong');
                            }
                        } 

                        if (msg.mode === 'edit') {
                            checkExisted(msg, phoneNumber);
                        }
                    }

                    async function checkExisted(x, y) {
                        let xyz = await joinedUsers.findOne({ phone_no: x.oldNum });
                        let deletedRow;
                        if (xyz) {
                            xyz.myPreference.forEach((e, index) => {
                                xyz.myPreference[index][1] === y ? [xyz.myPreference[index] = null, deletedRow = index] : '';
                            });

                            xyz.myPreference = xyz.myPreference.filter(e => e !== null);
                            await xyz.save();
                            send(xyz.id, 'notifie', { del: deletedRow }); // notify the person been got removed
                        }
                    }

                    function formatRetrieData(msg, vecantIndex) {
                        let row_1 = msg.closeWatch_1.length !== 0 ? msg.closeWatch_1[0] : 0;
                        let row_2 = msg.closeWatch_2.length !== 0 ? msg.closeWatch_2[0] : 0;
                        let row_3 = msg.closeWatch_3.length !== 0 ? msg.closeWatch_3[0] : 0;
                        let row_4 = msg.closeWatch_4.length !== 0 ? msg.closeWatch_4[0] : 0;
                        
                        let phoneNo_1 = msg.closeWatch_1.length !== 0 ? msg.closeWatch_1[1] : 0;
                        let phoneNo_2 = msg.closeWatch_2.length !== 0 ? msg.closeWatch_2[1] : 0;
                        let phoneNo_3 = msg.closeWatch_3.length !== 0 ? msg.closeWatch_3[1] : 0;
                        let phoneNo_4 = msg.closeWatch_4.length !== 0 ? msg.closeWatch_4[1] : 0;

                        let name_1 = msg.closeWatch_1.length !== 0 ? msg.closeWatch_1[2] : 0;
                        let name_2 = msg.closeWatch_2.length !== 0 ? msg.closeWatch_2[2] : 0;
                        let name_3 = msg.closeWatch_3.length !== 0 ? msg.closeWatch_3[2] : 0;
                        let name_4 = msg.closeWatch_4.length !== 0 ? msg.closeWatch_4[2] : 0;

                        let action_1 = msg.closeWatch_1.length !== 0 ? msg.closeWatch_1[3] : 0;
                        let action_2 = msg.closeWatch_2.length !== 0 ? msg.closeWatch_2[3] : 0;
                        let action_3 = msg.closeWatch_3.length !== 0 ? msg.closeWatch_3[3] : 0;
                        let action_4 = msg.closeWatch_4.length !== 0 ? msg.closeWatch_4[3] : 0;

                        let rows = [row_1, row_2, row_3, row_4];
                        let phoneNos = [phoneNo_1, phoneNo_2, phoneNo_3, phoneNo_4];
                        let names = [name_1, name_2, name_3, name_4];
                        let actions = [action_1, action_2, action_3, action_4];

                        if (vecantIndex) {
                            return {
                                row_1: row_1 === 0 ? row_1 : 'occupied',
                                row_2: row_2 === 0 ? row_2 : 'occupied',
                                row_3: row_3 === 0 ? row_3 : 'occupied',
                                row_4: row_4 === 0 ? row_4 : 'occupied'
                            }
                        }

                        return {
                            row: rows,
                            phoneNo: phoneNos,
                            name: names,
                            action: actions
                        }
                    }

                    function send(id, event, msg) {  
                        socketIO.sockets.to(id).emit(event, msg);
                    }

                });

                res.render("close-watch");
                res.end();

            } else {
                return res.redirect('Home');

            }

        } else {
            return res.redirect('LogIn');

        }
    });

    app.get('/WebG/Tour', async (req, res) => {
        const device = req.headers['user-agent'];
        const reqCookie = req.headers.cookie;
        
        if (req.headers['sec-fetch-site'] !== 'none' && reqCookie || reqCookie) {
            const parseCookie = await CheckPoint.parseCookie(Cookie, reqCookie, device);
            if (parseCookie.username && parseCookie.phone_no) {
// ================================= SOCKET CONNECTION =================================
                socketIO.once('connection', async (socket) => {
                    var UserName = parseCookie.username;
                    var phoneNumber = parseCookie.phone_no;
                    var id = socket.id;

                    socket.on("postContent", async (msg) => {
                        let blobDate, content;
                        try {
                            var ctn = new postCont({
                                userName: UserName,
                                phone_no: phoneNumber,
                                blob: blobDate,
                                content: content,
                                event: msg.event
                            });

                            await ctn.save();

                        } catch(err) {
                            socket.emit('warn', 'Something went wrong');
                        }
                    });

                    socket.on('getContent', async e => {
                        const ctn = await postCont.findOne({ id: _id });
                        if (ctn) {
                            console.log(ctn);
                        }
                    })

                });

                res.render('Tour');
                res.end();

            } else {
                return res.redirect("Home");
            }

        } else {
            return res.redirect("Home");
        }

    });

    app.get("/WebG/readMe", (req, res) => {
        res.render('readMe');
        return res.end();
    });
    
    app.post('/WebG/logOut', async (req, res) => {
        const device = req.headers['user-agent'];
        const reqCookie = req.headers.cookie;
        if (req.headers['sec-fetch-site'] !== 'none' && reqCookie) {
            let parseCookie = await CheckPoint.parseCookie(Cookie, reqCookie, device);
            if (!parseCookie.logOut) {
                let cookieUpdate = await CheckPoint.updateCookie(parseCookie.phone_no, null, device, 'logOut');
                if (cookieUpdate) {
                    res.setHeader('Set-Cookie', Cookie.serialize("credentials", JSON.stringify(cookieUpdate.updated.userCookie), cookieUpdate.updated.cookieOptions));
                    res.json({redirect: true}); 
                    return res.end();

                }
            }

        }

    });
    
    
    app.get('/', (req, res) => {
        res.render('Home');
        res.end();
    });
    
    function idle(x, path) {
        if (x === true) {
            setTimeout(() => {
                fs.unlink(`${path}`, (err) => {
                    if (err) return null;
                });
            }, 2000);
        }
    }
    
    //  Error Handler
    app.use((err, req, res, next) => {
        return res.send(err);
    });

    function print(x) {console.log(x);}
    
    server.listen(3000, '0.0.0.0', () => console.log('Worker started...', process.pid));

// }
