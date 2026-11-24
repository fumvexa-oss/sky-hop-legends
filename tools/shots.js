// Takes real 3D screenshots of every map (runs on GitHub's computers).
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{
  const out=path.join(__dirname,'..','shots');fs.mkdirSync(out,{recursive:true});
  const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
  const log=[];
  const shoot=async(name,vp,world,walk)=>{
    const pg=await b.newPage({viewport:vp,deviceScaleFactor:1,hasTouch:true,isMobile:true});
    pg.on('pageerror',e=>log.push(name+' ERROR '+e.message));pg.on('console',m=>{if(m.type()==='error')log.push(name+' console '+m.text())});
    await pg.goto('http://localhost:8080/index.html');await pg.waitForTimeout(2500);
    if(world==null){await pg.screenshot({path:path.join(out,name+'.png')});await pg.close();return}
    await pg.click('#playBtn');await pg.click('#world-'+world);await pg.click('#goBtn');await pg.waitForTimeout(4500);
    await pg.screenshot({path:path.join(out,name+'-start.png')});
    if(walk){await pg.keyboard.down('w');await pg.waitForTimeout(1600);await pg.keyboard.up('w');await pg.waitForTimeout(600);await pg.screenshot({path:path.join(out,name+'-run.png')});const ri=await pg.evaluate(()=>window.__ri?window.__ri():null);log.push(name+' RENDER '+JSON.stringify(ri))}
    await pg.close()};
  await shoot('00-home-landscape',{width:844,height:390});
  await shoot('00-home-portrait',{width:390,height:844});
  for(let i=0;i<12;i++)await shoot(String(i+1).padStart(2,'0')+'-map',{width:844,height:390},i,true);
  await shoot('13-portrait-race',{width:390,height:844},0,false);
  fs.writeFileSync(path.join(out,'log.txt'),log.length?log.join('\n'):'NO ERRORS');
  console.log(log.length?log.join('\n'):'NO ERRORS');await b.close();
})();
