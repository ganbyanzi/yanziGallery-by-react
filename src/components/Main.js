
require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';
/*let imageUrl = require('../images/yeoman.png');*/

//获取图片相关数据
var imageDatas = require('../data/imageDatas.json');

//利用自执行函数，将图片信息装好图片url路径信息
imageDatas = (function genImageURL(imageDatasArr){
	for (var i = 0,j = imageDatasArr.length; i<j;i++) {
		var singleImageData = imageDatasArr[i];
		
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);

		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);

/*
 * 取范围内的随机整数
 * @param  low,high
 */
 function getRangeRandom(low,high) {
     return Math.ceil(Math.random()*(high-low)+low);
 }

/*
 * 取范围内的随机整数
 * @param  low,high
 */
 function get30DegRandom(){
 	return ((Math.random() > 0.5 ? '' : '-') +Math.ceil(Math.random() * 30));
 }
//单个图片组件
class ImgFigure extends React.Component{

/*
 * 取范围内的随机整数
 * @param  low,high
 */
 handleClick(e){

 	if (this.props.arrange.isCenter) {
 		this.props.inverse();	
 	}else {
 		this.props.center();
 	}
 	e.stopPropagation();
 	e.preventDefault();
 };

  render(){
  	var styleObj={};
    //如果props属性中指定了这张图片的位置，则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    var imgFigureClassName = "photoimgfig";
    	imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';


    if (this.props.arrange.rotate){
    	(['-moz=', '-ms-', '-webkit-', '']).forEach(function(value, i){
    		styleObj['transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
    	}.bind(this));
    }
	//imgFigures.push(<img src={srcurl}/>);
    return(
/*    	<figure className="dfad" >  img-figure
    	<img src={this.props.data.imageURL}/>
    	</figure>*/

        <figure className={imgFigureClassName} style={styleObj} onClick={
        	this.handleClick.bind(this)}>
          <img  src={this.props.data.imageURL} alt={this.props.data.title} />
          <figcaption>
            <h2 className="img-title">{this.props.data.title}</h2>
    	    <div className="img-back" onClick={this.handleClick.bind(this)}>
    	    	<p>
    	    		{this.props.data.desc}
    	    	</p>
            </div>
          </figcaption>
        </figure>

      );
  }
}


class AppComponent extends React.Component {

	constructor(props) {
        super(props);
         /***位置范围常量***/
        this.state = { imgsArrangeArr: [
/*        		{
        			pos : {
        				left : '0',
        				top : '0'
        			},
        			rotate: 0,    //xuanzhuangjiaodu
        			isInverse: false, //tupianzhengfangmian,
        			isCenter: false
        		}*/
        	]};
        this.Constant= {
          centerPos:{
            left:0,
            top: 0
          },
          hPosRange:{
            leftSecX:[0,0],
            rightSecX:[0,0],
            h_y:[0,0]
          },
          vPosRange:{
            v_x:[0,0],
            v_y:[0,0]
          }
        };
    };

    componentDidMount(){
      /**舞台的宽高以及半宽半高**/
      var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.ceil(stageW/2),
            halfStageH = Math.ceil(stageH/2);
        //图片的宽高以及半宽半高
        var imgDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW = imgDOM.scrollWidth,
            imgH = imgDOM.scrollHeight,
            halfImgW = Math.ceil(imgW/2),
            halfImgH = Math.ceil(imgH/2);


      /**中央图片的位置**/
      this.Constant.centerPos = {
          left: halfStageW - halfImgW,
          top: halfStageH - halfImgH
      };
  /**水平方向上左右两侧图片范围start**/
      /**左**/
      this.Constant.hPosRange.leftSecX[0] = -halfImgW;
      this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
      /**右**/
      this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
      this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
      /**垂直**/
      this.Constant.hPosRange.h_y[0] = -halfImgH;
      this.Constant.hPosRange.h_y[1] = stageH - halfImgH;
  /**水平方向上左右两侧图片范围end**/
 /**垂直方向上顶部图片范围start**/
      this.Constant.vPosRange.v_x[0] = halfStageW - imgW;
      this.Constant.vPosRange.v_x[1] = halfStageW;
      this.Constant.vPosRange.v_y[0] = -halfImgH;
      this.Constant.vPosRange.v_y[1] = halfStageH - halfStageH*3;
  /**垂直方向上顶部图片范围end**/
      /**默认居中第一章图片**/
      this.rearrange(0);
  };

/*
*
* 闭包函数 其内部放回一个真真的被执行的函数
*/
inverse(index){

	return function(){
		var imgsArrangeArr = this.state.imgsArrangeArr;

		imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

		this.setState({
			imgsArrangeArr: imgsArrangeArr
		});
	}.bind(this);
};


/*
*
*
*/
center(index){
	return function(){
		this.rearrange(index);
	}.bind(this);
}

/*
*
*
*/
  rearrange(centerIndex){
  	var imgsArrangeArr = this.state.imgsArrangeArr, //获取图片位置信息数组
          Constant = this.Constant,                   //获取定位位置对象
          centerPos = Constant.centerPos,             //获取  居中位置信息
          hPosRange = Constant.hPosRange,             //获取  水平位置信息
          h_leftSecX = hPosRange.leftSecX,              //获取  左侧x位置信息
          h_rightSecX= hPosRange.rightSecX,             //获取  右侧x位置信息
          h_y = hPosRange.h_y,                          //获取  y位置信息
          vPosRange = Constant.vPosRange,             //获取  顶部位置信息
          v_x = vPosRange.v_x,                          //获取  顶部x位置信息
          v_y = vPosRange.v_y;                          //获取  顶部y位置信息

      //获取居中图片index并居中处理
      var imgsArrangeArrCenter = imgsArrangeArr.splice(centerIndex,1);
          imgsArrangeArrCenter.pos= centerPos;
          imgsArrangeArrCenter.rotate = 0;
          imgsArrangeArrCenter.isCenter = true;

      //获取顶部图片index并处理get30DegRandom
      var topImgNum = Math.ceil(Math.random()*2),
          topIndex = 0,
          imgsArrangeArrTop = [];
          if (topImgNum) {
            topIndex = Math.ceil(Math.random()*(imgsArrangeArr.length-topImgNum+1));
            imgsArrangeArrTop = imgsArrangeArr.splice(topIndex,topImgNum);
            imgsArrangeArrTop.forEach(function(value,index){
              imgsArrangeArrTop[index] = {
              	pos : {
	                left: getRangeRandom(v_x[0],v_x[1]),
	                top: getRangeRandom(v_y[0],v_y[1])
              	},
              	rotate: get30DegRandom(),
              	isCenter: false
              }

            });
          }
      //获取水平方向上的图片信息并处理
      var k = Math.ceil(imgsArrangeArr.length/2);
      for (var i = 0; i <  imgsArrangeArr.length; i++) {
          if (i<k) {
            imgsArrangeArr[i] = {
            	pos: {
	              left:  getRangeRandom(h_leftSecX[0],h_leftSecX[1]),
	              top: getRangeRandom(h_y [0],h_y [1])
            	},
            	rotate: get30DegRandom(),
            	isCenter: false

            }

          }else{
            imgsArrangeArr[i] = {
            	pos: {
	              left: getRangeRandom(h_rightSecX[0],h_rightSecX[1]),
	              top: getRangeRandom(h_y [0],h_y [1])
            	},
            	rotate: get30DegRandom(),
            	isCenter: false
            }
          }
      }

      //将取出的数组元素修改之后放回去
      //顶部图片
      if (imgsArrangeArr && imgsArrangeArrTop) {
        for (var i = topImgNum-1; i >= 0; i--) {
           imgsArrangeArr.splice(topIndex,0,imgsArrangeArrTop[i]);
        }
      }
      //中间图片
      imgsArrangeArr.splice(centerIndex,0,imgsArrangeArrCenter);

      this.setState({
          imgsArrangeArr: imgsArrangeArr
      });
  };

  render() {
  	var controllerUnits = [],
  		that = this,
  		imgFigures = [];

	imageDatas.map(function (value, index){
		//如果图片的位置信息不存在的话，初始化所有图片位置
         if (!that.state.imgsArrangeArr[index]) {
            that.state.imgsArrangeArr[index]={
                pos:{
                  left:0,
                  top:0,
                },
                rotate : 0,
                isInverse: false,
                isCenter: false
            }
        };

		imgFigures.push(<ImgFigure data={value} ref={'imgFigure'+index} 
			arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
	}.bind(this));

    return (
      <section className="stage" ref="stage">
          <section className="img-sec">
            {imgFigures}
          </section>
          <nav className="controller-nav">
            {controllerUnits}
          </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
