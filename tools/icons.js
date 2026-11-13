const {chromium}=require('playwright');
(async()=>{
  const b=await chromium.launch();const pg=await b.newPage({viewport:{width:512,height:512},deviceScaleFactor:1});
  await pg.goto('file://'+__dirname+'/icon.html');
  await pg.locator('#ic').screenshot({path:__dirname+'/../icon-512.png'});
  await pg.evaluate(()=>document.querySelector('.safe').style.setProperty('--k','.78'));
  await pg.locator('#ic').screenshot({path:__dirname+'/../icon-maskable-512.png'});
  await pg.evaluate(()=>document.querySelector('.safe').style.setProperty('--k','1'));
  const p2=await b.newPage({viewport:{width:512,height:512},deviceScaleFactor:.375});
  await p2.goto('file://'+__dirname+'/icon.html');await p2.locator('#ic').screenshot({path:__dirname+'/../icon-192.png'});
  await b.close();
})();
