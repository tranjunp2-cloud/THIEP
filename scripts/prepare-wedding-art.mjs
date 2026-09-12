import sharp from 'sharp';
import { existsSync, mkdirSync, copyFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
const source = process.argv[2] ?? 'assets/originals/wedding';
const specs = {'guests':1400,'leafy-garland':1600,'candles':1600,'chapel':320,'rings':320,'cocktail':320,'disco':320,'champagne':320,'recovery-building':1000,'gifts-frame':1000,'envelope':500,'topiary':500,'estate-panorama':1600,'ceremony-frame':1200,'floral-side':600,'silver-seal':400};
const manifest={};
mkdirSync('public/images/wedding',{recursive:true});
mkdirSync('assets/originals/wedding',{recursive:true});
for(const [name,width] of Object.entries(specs)){
 const input=join(source,`${name}.png`);
 if(!existsSync(input)) continue;
 const original = `assets/originals/wedding/${name}.png`;
 if(resolve(input)!==resolve(original)) copyFileSync(input,original);
 const info=await sharp(input).resize({width,withoutEnlargement:true}).webp({quality:84,alphaQuality:95,effort:5}).toFile(`public/images/wedding/${name}.webp`);
 manifest[name]={width:info.width,height:info.height,bytes:info.size};
 if(info.width>640){
  const small=await sharp(input).resize({width:640}).webp({quality:82,alphaQuality:95,effort:5}).toFile(`public/images/wedding/${name}-640.webp`);
  manifest[name].smallWidth=small.width;
 }
}
writeFileSync('app/wedding-art-manifest.json',JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify(manifest,null,2));
