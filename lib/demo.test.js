const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
var colors = require('colors');
const sinonChai = require('sinon-chai')
const sinon = require('sinon')
var rewire = require('rewire')

const logger = require('../utils/util.logger')
let demo = rewire('./demo')

const expect = chai.expect

chai.use(chaiAsPromised)
chai.use(sinonChai)

describe('demo', () => {
    context('add', () => {
        logger.beforeAfter(before, after, beforeEach, afterEach)
        it('should add 2 numbers', () => {
            expect(demo.add(1, 2)).to.equal(3)
        })
    })

    context('addCallback', () => {
        logger.beforeAfter(before, after, beforeEach, afterEach)
        it('should test the callback add', (done) => {
            demo.addCallback(1, 2, (err, result) => {
                expect(err).to.not.exist
                expect(result).to.equal(3)
                done()
            })
        })
   })

    context('addPromise', () => {
        logger.beforeAfter(before, after, beforeEach, afterEach)
        it('should add with a promise cb', (done) => {
            demo.addPromise(1, 2)
                .then(result => {
                    expect(result).to.equal(3)
                    done()
                })
                .catch(e => {
                    logger.errorLogger(e)
                    done(e)
                })
        })
       
        it('should test add promise with async/await', async () => {
            const result = await demo.addPromise(1, 2)
            expect(result).to.equal(3)
        })
        it('should test add promise with chai as promised', async () => {
            await expect(demo.addPromise(1, 2)).to.eventually.equal(3)
        })
    })
    context('test doubles (foo function)', () => {
        logger.beforeAfter(before, after, beforeEach, afterEach)
        it('should spy on log', () => {
            const spy = sinon.spy(console, 'log') //first parametry library or method  look at medium source for info

            demo.foo()
            expect(spy.calledOnce).to.be.true
            expect(spy).to.have.been.calledOnce
            expect(spy).to.have.been.calledWith('console.log was called') 
            spy.restore()
        })
        it('should stub on warn',async () => {
            const stub = sinon.stub(console, 'warn').callsFake(() => { console.log('Message from stub') })

          await  demo.foo()
            expect(stub).to.have.been.calledOnce
            expect(stub).to.have.been.calledWith('console.warn was called') 
            stub.restore()

        })
    })

    context('stub private function (bar function)', () => {
        logger.beforeAfter(before, after, beforeEach, afterEach)
        it('should stub createFile', async () => {
             const createStub = sinon.stub(demo, 'createFile').resolves('createFile_stub') 
            //burda createStub b??r fonks??yon b??z demo.bardaki calldb yi ??l??mek istedik burda sadece bunu kullnarak promise olarak hata almamas??n?? ??nledik calldbyi ??l??tuk cunku bar fonks??yonu ??c??nde result olarak onun sonucunu verdi
          
            // const callStub = sinon.stub(demo, 'callDB').resolves('callDB_stub') bunu yapamay??z export edilmemi?? ondan export edilmemi?? bir??eye inject i??in rewire kulland??k  ve bu ??ekilde yapt??k
            const callStub = sinon.stub().resolves('callDB_stub')
            demo.__set__('callDB', callStub)  

            const result = await demo.bar('test.txt')
            expect(result).to.equal('callDB_stub')
            expect(createStub).to.have.been.calledOnce
        
            expect(createStub).to.have.been.calledWith('test.txt')
            expect(callStub).to.have.been.calledOnce
            expect(callStub).to.have.been.calledWith('test.txt')
            createStub.restore()
        })
    })
})