const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const mongoose = require('mongoose')
const rewire = require('rewire')
let users = rewire('./users')
const mailer = require('./mailer')

const sandbox = sinon.createSandbox()
const expect = chai.expect

chai.use(chaiAsPromised)
chai.use(sinonChai)



describe("users",()=>{
    let findStub;
    let sampleArgs;
    let sampleUser;

    beforeEach(() => {
      
        sampleUser = {
            id: 123,
            name: 'Karl Jfdjkdfjkdfjkoe',
            email: 'karljose@buena.com',
              save: sandbox.stub().resolves() // update context için buraya yazıldı update context yazılırken ilk önce bu save users.js de kullanılmış dıkkatlıce bak
        }
          findStub = sandbox.stub(mongoose.Model, 'findById').resolves(sampleUser)// update context için kullanıldı
       
        deleteStub = sandbox.stub(mongoose.Model, 'remove').resolves('fake_remove_result')    
     mailerStub = sandbox.stub(mailer, 'sendWelcomeEmail').resolves('fake_email')
    })
    afterEach(() => {
        sandbox.restore()
         users = rewire('./users')
    })


    context("get",()=>{

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
             //bunun sayesinde get fonksıyonu ıcındekı fındbyıd sonucu  { name: 'karljose' } bu oluyor yields ile içine inject ettik
             //yields da findbyıd de callback oldugunu unutma ayrılan nokta bu resolveden

            users.get(123, (err, result) => {
                expect(err).to.not.exist;
                expect(stub).to.have.been.calledOnce

                expect(stub).to.have.been.calledWith(123)
                expect(result).to.be.a('object')
                expect(result).to.deep.equal({ name: 'karljose' })
                expect(result).to.have.property('name').to.equal('karljose')
                done()
            })
        })

            //yield insert new error and called get user function
        it('should catch error if there is one', (done) => {
            sandbox.restore()
            const stub = sandbox.stub(mongoose.Model, 'findById').yields(new Error('fake'))
            //bu senaryoda ıd var ama bir sebepten catch de hata yakalandıgını duşün

            users.get(123, (err, result) => {
                expect(result).to.not.exist
                expect(err).to.exist
                expect(err).to.be.an.instanceOf(Error)
                expect(err.message).to.equal('fake')
                expect(stub).to.have.been.calledOnce
                done()
            })
        })





    })

   
    context('delete user', () => {
        it('should check for an id using return', () => {

            return users.delete().then(result => {
                throw new Error('unexpected success')
            }).catch(err => {
                expect(err).to.be.instanceOf(Error)
                expect(err.message).to.equal('Invalid id')
            })
        })

        it('should check for error using eventually', () => {
            expect(users.delete()).to.eventually.be.rejectedWith('Invalid id')
        })

        it('should call User.delete and check for return value using async/await', async () => {
            const result = await users.delete(123)

            expect(result).to.equal('fake_remove_result')
            expect(deleteStub).to.have.been.calledOnce
            expect(deleteStub).to.have.been.calledWith({ _id: 123 })
        });
    })



    describe('create user', () => {
        let FakeUserClass, saveStub, result

        beforeEach(async () => {
           
            saveStub = sinon.stub().resolves(sampleUser)
            FakeUserClass = sinon.stub().returns({ save: saveStub })

            users.__set__('User', FakeUserClass)
            result = await users.create(sampleUser)
        })
        it('should reject invalid args', () => {
            expect(users.create()).to.eventually.be.rejectedWith('Invalid arguments')
            expect(users.create({ name: 'karl' })).to.eventually.be.rejectedWith('Invalid arguments')
            expect(users.create({ email: 'karl@buena.com' })).to.eventually.be.rejectedWith('Invalid arguments')
        })
        it('should call User with new', () => {
            expect(FakeUserClass).to.have.been.calledWithNew
            expect(FakeUserClass).to.have.been.calledWith(sampleUser)
        })
        it('should save the user', () => {
            expect(saveStub).to.have.been.calledOnce
          
        })
        it('should call mailer with email and name', () => {
            expect(mailerStub).to.have.been.calledOnce
            expect(mailerStub).to.have.been.calledWith(sampleUser.email, sampleUser.name)
        })
        it('should reject errors', async () => {
            saveStub.rejects(new Error('fake'))

            await expect(users.create(sampleUser)).to.eventually.be.rejectedWith('fake')
        })
    })

    

    describe('update', () => {
        it('should find user by id', async () => {
           let resultUp =  await users.update(1235, { age: 31 })

           expect(resultUp).to.equal(undefined)
            expect(findStub).to.have.been.calledOnce
            expect(findStub).to.have.been.calledWith(1235)
        })
        it('should call user.save', async () => {
            await users.update(123, { age: 31 })

            expect(sampleUser.save).to.have.been.calledOnce
        })
        it('should rejects errors', async () => {
            findStub.throws(new Error('fake'))

            await expect(users.update(123, { age: 31 })).to.be.eventually.rejectedWith('fake')
        })
    })

    context('resetPassword', () => {
        let resetStub

        beforeEach(() => {
            resetStub = sandbox.stub(mailer, 'sendPasswordResetEmail').resolves('reset')
        })

        it('should for invalid email', async () => { //error
            await expect(users.resetPassword()).to.be.eventually.rejectedWith('Invalid email')
        })

        it('should check if there was an upon calling mailer sendPasswordResetEmail', async () => {
            resetStub.rejects(new Error('Invalid input')) //resolves yerine reject atadım yanı inject ettim
            await expect(users.resetPassword('karl@buena.com')).to.eventually.rejectedWith('Invalid input')
        })
        it('should call mailer sendPasswordResetEmail', async () => {
           let resultTy =  await users.resetPassword('karl@buena.com')

            expect(resultTy).to.equal("reset")
            expect(resetStub).to.have.been.calledOnce
            expect(resetStub).to.have.been.calledWith('karl@buena.com')
        })
    });

})