import express from 'express';
import path from 'path'
let router = express.Router();

router.get('/',(req,res, next)=>{
  console.log('now in router')
});

export default router;
