// news array

//global var
window.ee = new EventEmitter();

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
    getInitialState: function(){
        return {
            news: some_news
        }
    },
    componentDidMount : function(){
        /*
        * слушай событие "создана новость"
        * если событие произошло, обнови this.state.news
        * */

        var self = this;

        window.ee.addListener('New.add', function(item){
            var nextNews = item.concat(self.state.news);

            self.setState({news: nextNews});
        })
    },
    componentWillUnmount: function(){
        /*
        * Больше не слушай событие "Создана новость"
        * */

        window.ee.removeListener('New.add');
    },
    render: function () {
        console.log('render');
        return (
            <div className="app">
                <h3>Новости</h3>
                <UncontrolledTestInput />
                <TestInput />
                <News data={this.state.news}/> {/*  data={some_news} добавили свойства data*/}
                <Add />
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

var Add = React.createClass({
    onButtonClickHandler: function(e){
        e.preventDefault();
        var author =  ReactDOM.findDOMNode(this.refs.author).value,
            news = ReactDOM.findDOMNode(this.refs.text).value,
            textEl = ReactDOM.findDOMNode(this.refs.text);

        var item = [{
            author : author,
            text : news,
            bigText: '...'
        }];

        window.ee.emit('New.add', item);

        textEl.value = '';
        this.setState({textIsEmpty: true});
    },
    getInitialState: function(){
      return{
          btnIsDisabled : true,
          authorIsEmpty: true,
          textIsEmpty: true
      }
    },
    onCheckRuleClick: function(e){
        this.setState({btnIsDisabled: !this.state.btnIsDisabled}); //изменяет на НЕ то что было
        //ReactDOM.findDOMNode(this.refs.alert_button).disabled = !e.target.checked;
    },
    onChangeInputText : function(e){
      if(e.target.value.trim().length > 0){
          this.setState({textIsEmpty : false })
      }else{
          this.setState({textIsEmpty: true})
      }
    },
    onChangeInputAuthor : function(e){
        if(e.target.value.trim().length > 0){
            this.setState({authorIsEmpty : false })
        }else{
            this.setState({authorIsEmpty : true})
        }
    },
    onFieldChange : function(fieldName, e) {
        if(e.target.value.trim().length > 0){
            this.setState({[''+fieldName] : false })
        }else{
            this.setState({[''+fieldName] : true})
        }
    },
    render: function(){
        return (
            <form className="add cf">
                <input
                    className="add__author"
                    onChange = {this.onFieldChange.bind(this, 'authorIsEmpty')}
                    placeholder="Ваше имя"
                    ref="author"
                    type="text"
                />
                <textarea
                    onChange = {this.onFieldChange.bind(this, 'textIsEmpty')}
                    placeholder="Текст новости"
                    ref="text"
                    className="add__text">
                </textarea>
                <label className="add__checkrule">
                    <input
                        className=""
                        //defaultChecked={false}
                        ref="checkrule"
                        type="checkbox"
                        onChange = {this.onCheckRuleClick}
                    /> Я согласен с правилами
                </label>
                <button
                    className="add__btn"
                    disabled={this.state.btnIsDisabled || this.state.authorIsEmpty || this.state.textIsEmpty}
                    onClick={this.onButtonClickHandler}
                    ref="alert_button"
                >
                    Добавить новость
                </button>
            </form>
        )
    }
});

//точка выхода
ReactDOM.render(
    <App/>,
    document.getElementById('root')
);