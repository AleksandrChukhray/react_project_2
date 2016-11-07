// news array


//model
var some_news = [
    {
        author : 'Cаша Печкин',
        text : 'В четверг, четвертого числа...',
        bigText : 'в четыре с четвертью часа четыре чёрненьких чумазеньких чертёнка чертили чёрными чернилами чертёж.'
    },
    {
        author : 'Просто Вася',
        text : 'Считаю, что доллар должен стоить 35 рублей!',
        bigText: 'А евро 42!'
    },
    {
        author : 'Гость',
        text : 'Бесплатно. Скачать. Лучший сайт - http://localhost:3000',
        bigText: 'На самом деле платно, просто нужно прочитать очень длинное лицензионное соглашение'
    }
];


//class New
var News = React.createClass({
    getInitialState : function(){
        return {
            visible: false
        }
    },

    render: function () {
        var data = this.props.data,
            newTemplate;

        if(data.length > 0){
            newTemplate = data.map(function(item, index){
                return (
                    <Article key={index} data={item} />
                )
            });
        }else{
            newTemplate = <p>К сожалению новостей нет</p>
        }

        return (
            <div className="news">
                {newTemplate}
                <strong  className={'news__count ' + (data.length > 0? ' ':'none')}>Всего новостей: {data.length}</strong>
            </div>
        )
    }
});

//class Article
var Article = React.createClass({

    propTypes: {
        data: React.PropTypes.shape({
            author: React.PropTypes.string.isRequired,
            text: React.PropTypes.string.isRequired,
            bigText: React.PropTypes.string.isRequired
        })
    },
    getInitialState : function(){
        return {
            visible: false
        }
    },
    readMoreClick : function(e){
        e.preventDefault();
        this.setState({visible: true}, function(){
        });
    },
    render : function(){

        var author = this.props.data.author,
            text = this.props.data.text,
            bigText = this.props.data.bigText,
            visible = this.state.visible;

        return (
            <div className="article">
                <p className="news__author">{author}</p>
                <p className="news__text">{text}</p>
                <a href="#"
                   className="news__read-more"
                   onClick={this.readMoreClick}>Подробнее</a>
                <p className={"news__big-text " + (visible?" ":"none")}>{bigText}</p>
            </div>
        )
    }
});


//class App
var App = React.createClass({
    propTypes: {
        //data: React.PropTypes.array.isRequired
    },
    render: function () {
        return (
            <div className="app">
                <h3>Новости</h3>
                <UncontrolledTestInput />
                <TestInput />
                <News data={some_news}/> {/*  добавили свойства data*/}
            </div>
        )
    }
});

var TestInput = React.createClass({
    getInitialState : function(){
        return {
            myValue: ''
        }
    },
    changeValue : function(e){
        this.setState({myValue: e.target.value});
    },
    onBtnClickHandler: function() {
        alert(this.state.myValue + 'hello');
    },
    render: function(){
        console.log('hello');
        return(
            <div>
                <input
                    className="test-input"
                    value={this.state.myValue}
                    onChange={this.changeValue}
                    placeholder="Введите значение"
                />
                <button onClick={this.onBtnClickHandler}>Показать alert !!!</button>
            </div>
        )
    }
});

var UncontrolledTestInput = React.createClass({
    componentDidMount: function(){
        ReactDOM.findDOMNode(this.refs.myTestInput).focus();
    },
    onBtnClickHandler: function() {
        console.log(this.refs);
        alert(ReactDOM.findDOMNode(this.refs.myTestInput).value);
    },
    render: function(){

        return(
            <div>
                <input
                    className="test-input"
                    defaultValue=""
                    ref="myTestInput"
                    placeholder="Введите значение"
                />
                <button onClick={this.onBtnClickHandler}>Показать alert !!!</button>
            </div>
        )
    }
});

//точка выхода
ReactDOM.render(
    <App/>,
    document.getElementById('root')
);