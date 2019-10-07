const express= require('express')
const router= express.Router()
const Instagram= require('node-instagram').default
const {clientId,clientSecret} =require('../keys').instagram
//modulo
const instagram= new Instagram({
    clientId:clientId,
    clientSecret:clientSecret
})


router.get('/',(req,res)=>{
    res.render('index')
})

const redirectUri='http://localhost:8000/handleauth'
router.get('/auth/instagram',(req,res)=>{
    res.redirect(
        instagram.getAuthorizationUrl(
            redirectUri,{
                scope: ['basic'],
                  state:'your state'
            
             },
             
        
        )
    )

})

router.get('/handleauth', async (req,res)=>{
    try {
        // The code from the request, here req.query.code for express
        const code = req.query.code;
        //va a tomar tiempo y luego lo voy a manejar
        const data = await instagram.authorizeUser(code, redirectUri);
        // data.access_token contain the user access_token
        //almacenar el acces_token
        req.session.access_token=data.access_token
        req.session.user_id=data.user.id
        //guardar el acces token
        instagram.config.accessToken =req.session.access_token
        res.redirect('/profile')
       
      } catch (err) {
        res.json(err);
      }

})
router.get('/login',(req,res)=>{
    res.redirect('/auth/instagram')

})
router.get('/logout',()=>{
    
})
router.get('/profile',async (req,res)=>{
    //trabajar con endpoints
    try{
        const profileData= await instagram.get('users/self')
        const media= await instagram.get('users/self/media/recent')
        const megusta= media.data[0].likes.count
        res.render('profile',{user:profileData.data,posts:media.data,megustas:megusta})

    }catch(e){
        console.log(e)
    }
    
})



module.exports=router