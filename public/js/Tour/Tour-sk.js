export const socket = io("ws://localhost:3000");

socket.emit('getContent', true);
socket.on('warn', (wn) => {
    console.log(wn);
});


function postCont(ctn, blob) {
    let date = new Date().toLocaleDateString();
    let tm = new Date().toLocaleTimeString();
    socket.emit('postContent', {
        blob: '73863478623',
        ctn: 64757622,
        event: date + " " + "-" + " " + tm
    });
}
// postCont(1,1);