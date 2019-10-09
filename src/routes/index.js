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
        //Aqui se almacena el usuario
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
router.get('/logout',(req,res)=>{
    delete req.session.access_token
    delete req.session.user_id

    //delete instagram.config.accessToken
    res.redirect('/')
    
})
router.get('/profile',async (req,res)=>{
    //trabajar con endpoints
    try{
        const profileData= await instagram.get('users/self')
        const media= await instagram.get('users/self/media/recent')
        const megusta= media.data[0].likes.count
       // console.log(media.data)
        //media.data.forEach(function(element){
          //  console.log(element)
       // })
    
       console.log(profileData.data.counts.followed_by)
       var seguidores=profileData.data.counts.followed_by
       var sumatoria=0
       var cantidad=media.data.length
  
      // console.log(media.data)
      //console.log(media.data[0].images)
       console.log(cantidad)
        for(const prop in media.data){
            console.log(`${prop}= ${media.data[prop].likes.count}`)
            sumatoria+=media.data[prop].likes.count
           // console.log(sumatoria)
        }  

        var promlikes=sumatoria/cantidad
        console.log('promedio de likes: ',promlikes)        
        var efic=((promlikes/seguidores)*100).toFixed(2)
        //console.log(efic.toFixed(2),'%')
        console.log(efic,' %')
        const estd={promlikes,efic}
        res.render('profile',{user:profileData.data,posts:media.data,estadisticas:estd})

    }catch(e){
        console.log(e)
    }
    
})



module.exports=router