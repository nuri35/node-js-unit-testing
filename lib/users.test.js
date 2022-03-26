const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const mongoose = require('mongoose')
const rewire = require('rewire')
let users = rewire('./users')
// const mailer = require('./mailer')

const sandbox = sinon.createSandbox()
const expect = chai.expect

chai.use(chaiAsPromised)
chai.use(sinonChai)



describe("users",()=>{
    let findStub;
    let sampleArgs;
    let sampleUser;

    beforeEach(()=>{
        sampleUser = {
            id: 123,
            name: 'Karl Joe',
            email: 'karljose@buena.com',
            save: sandbox.stub().resolves()
        }

        findStub = sandbox.stub(mongoose.Model,"findById").resolves()


    })

    afterEach(()=>{
        sandbox.restore()



    })


    describe("get",()=>{

        it("should check for and id",(done)=>{

            users.get(null, (err, result) => {
                expect(err).to.exist
                expect(err.message).to.equal('Invalid user id')
                done()
            })




        })


        it('should call user findById with id and returns result', (done) => {
            sandbox.restore();
             const stub = sandbox.stub(mongoose.Model, 'findById').yields(null, { name: 'karljose' })

            users.get(123, (err, result) => {
       
                expect(err).to.not.exist
                expect(stub).to.have.been.calledOnce
                expect(stub).to.have.been.calledWith(123)
                expect(result).to.be.a('object')
                expect(result).to.deep.equal({ name: 'karljose' })
                expect(result).to.have.property('name').to.equal('karljose')
                done()
            })
        })


    })



})