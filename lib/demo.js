exports.add = function (a, b) {
    return a + b
}

exports.addCallback = function (a, b, callback) {
    setTimeout(() => {
        return callback(null, a + b);
    }, 500);
}

exports.addPromise = function (a, b) {
   
    return Promise.resolve(a + b)
}

//spy on log
exports.foo = async() => {
    //some operation
    // await exports.logx() // 68.satırda demo.test js de hata verecek cunku await li birşey yaptk testimizde warn ile birşey yapnıca foo fonksıyonun ıcnıde promise başka fonksyıon oldugu ıcın hata verıyor  testımızde gıderız const createStub = sinon.stub(demo, 'logx').resolves('createFile_stub')  seklınde dıyerek bu hatadan kurtulmus oluruz *******
   console.log("console.log was called")
    console.warn('console.warn was called');

    return;
}

exports.logx = async ()=>{
  return  new Promise((resolve) => {
        setTimeout(() => {
            console.log('console.log was called');
        }, 100);
    });
    
}

//stub createfile
exports.bar = async (fileName) => {
    await exports.createFile(fileName); //exports etmessen test kısmında cagırdıgında bar fonskıyonunu createfile not defıned hatası alıyoruz
    let result = await callDB(fileName); //not export not reachable and  private function you can use rewire library

    return result;
}

exports.createFile = (fileName) => {
    console.log('---in createFile')
    //fake create file
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('fake file created');
            return Promise.resolve('done');
        }, 100);
    });
}

function callDB(fileName) {
    console.log('---in callDB')
    //fake create file
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('fake db call');
            resolve('saved');
        }, 100);
    });
}