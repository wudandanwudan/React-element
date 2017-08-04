/**
 * Created by lau on 2017/8/2.
 */
/**
 * Created by mty on 2017/8/2.
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router-dom'
import BScroll from 'better-scroll';
import Shopcart from '../shopcart/shopcart'
import Cartcontrol from '../cartcontrol/cartcontrol'
import Food from '../food/food'
import { addFoodCount } from '../../Redux/actions'

class goods extends Component {
    constructor() {
        super()
        this.state = {
            classMap: [
                'icon decrease',
                'icon discount',
                'icon special',
                'icon invoice',
                'icon guarantee'
            ],
            goods: [],
            listHeight: [],
            scrollY: 0,
            selectedFood: {},
            menuCurrent:0,
            selectFoods: [],
            foodShow:false
        }
    }
    componentWillMount(){
        const {dispatch} = this.props
        dispatch(addFoodCount(this.props.state.initGetData.goods))
    }
    componentDidMount() {
        this.meunScroll = new BScroll(this.refs.menuWrapper, {
            click: true
        });

        this.foodsScroll = new BScroll(this.refs.foodsWrapper, {
            click: true,
            probeType: 3
        });

        this.foodsScroll.on('scroll', (pos) => {
            this.state.scrollY = Math.abs(Math.round(pos.y));
        });
        // let foodList = this.refs.foodList;
        // let height = 0;
        // let listHeights = []
        // listHeights.push(height);
        // for (let i = 0; i < foodList.length; i++) {
        //     let item = foodList[i];
        //     height += item.clientHeight;
        //     listHeights.push(height);
        // }
        // this.setState({
        //     listHeight: listHeights
        // })
    }
    selectMenu(index) {
        this.setState({
            menuCurrent: index
        })
        // console.log(index)
        // let foodList = this.refs.foodList;
        // let el = foodList[index];
        // this.foodsScroll.scrollToElement(el, 300);
    }
    selectFood(food,event){
        console.log(event)
        console.log('food'+food)
        this.setState({
            foodShow:true
        })
    }
    addFood(e,food) {
        // console.log("json"+JSON.stringify(this.props.state.initGetData.goods))
        const foods = []
        this.props.state.modifyData.forEach((good,i) => {
            good.foods.forEach((food,index) =>{
                food.i = i;
                food.index = index;
                if(food.count>0){
                    foods.push(food)
                }
            })
        })
        this.setState({
            selectFoods: foods
        })
    }
    render() {
        const goods = this.props.state.initGetData.goods;
        const iconImg = {
            width: '57px',
            height: '57px'
        }
        return (
            <div className="wrapper" >
                <div className="tab border-1px">
                    <div className="tab-item">
                        <a href="javascript:void(0)" className="active">商品</a>
                    </div>
                    <div className="tab-item">
                        <Link to="/ratings">评论</Link>
                    </div>
                    <div className="tab-item">
                        <Link to="/seller">商家</Link>
                    </div>
                </div>
                <div className="goods-contain">
                    <div className="menu-wrapper" ref="menuWrapper">
                        <ul>
                            {
                                goods.map((element, index)=>(
                                    <li
                                        className={(this.state.menuCurrent===index?'current':'')+' menu-item'}
                                        onClick={this.selectMenu.bind(this,index)}
                                        key={index} >
                                        <span className="text border-1px">
                                            {element.type>0?(<span className={this.state.classMap[element.type]}></span>):''}
                                            {element.name}
                                        </span>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className="foods-wrapper" ref="foodsWrapper">
                        <ul>
                            {
                                goods.map((item, i)=> (
                                    <li className="food-list" ref="foodList" key={i}>
                                        <h1 className="title">
                                            {item.name}
                                        </h1>
                                        <ul>
                                            {
                                                item.foods.map((food, index)=> (
                                                    <li className="food-item border-1px"  key={index} onClick={this.selectFood.bind(this,food)}>
                                                        <div className="icon">
                                                            <img style={iconImg} src={food.icon} alt="图片"/>
                                                        </div>
                                                        <div className="content">
                                                            <h2 className="name">{food.name}</h2>
                                                            <p className="desc">{food.description}</p>
                                                            <div className="extra">
                                                                <span className="count">月售{food.sellCount}份</span><span>好评率{food.rating}%</span>
                                                            </div>
                                                            <div className="price">
                                                                <span className="now">￥{food.price}</span>
                                                                {food.oldPrice?(<span className="old">￥{food.oldPrice}</span>):''}
                                                            </div>
                                                            <div className="cartcontrol-wrapper">
                                                                <Cartcontrol add={this.addFood.bind(this)}
                                                                             food={food}
                                                                             goods = {goods}
                                                                             i={i}
                                                                             index = {index}
                                                                />
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <Shopcart rel="shopcart"
                              selectFoods={this.state.selectFoods}
                              add={this.addFood.bind(this)}/>
                </div>
                {this.state.foodShow?(<Food/>):''}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        state: state
    }
}

export default connect(
    mapStateToProps
)(goods)