'use strict';

/**
 * @author Joel Haowen TONG
 * Checks the ratio of Hangeul to English characters in a text.

 * NOTE: Regex to check Hangeul token string modified from
 * http://stackoverflow.com/a/19988857/1378959
 */

// Enter string here.
var testText = "1. AOP란?\n" +
    "스프링의 가장 큰 특징을 이야기하라고 하면 여러가지가 있겠지만, 가장 중요한 것은 IoC, DI 그리고 AOP가 아닐까 싶다.\n" +
    "각각 Inversion of Controller(제어 역전), Dependency Injection(의존관계 주입), Aspect Orient Programming(관점 지향 프로그래밍)의 약자이다.\n" +
    "이 중에서 AOP에 대해서 조금 더 알아보자.\n" +
    "관점 지향 프로그래밍이라는 단어를 처음 들어보는 경우도 있겠지만, 우리는 비슷한 단어를 많이 들어봤었다.\n" +
    "바로 Java의 OOP(Object Oriented Programming) - 객체 지향 프로그래밍이라는 단어와 앞 단어만 다르다는것을 알 수 있다.\n" +
    "\n" +
    "그럼 AOP에 대해서 이야기하기에 앞서 OOP가 무엇인지 간단히 살펴보자.\n" +
    "OOP라는 개념은 기존 C언어 등에서 사용되던 구조적 프로그래밍의 개념과 완전히 달랐다.\n" +
    "구조적 프로그래밍에서 OOP로 넘어가면서 개발자들은 큰 혼란을 겪기도 했다고 한다.\n" +
    "그렇미나 객체의 개념이나 재사용등과 같은 어려가지 개념들은 기존의 구조적 프로그래밍을 하던 사람들에게 쉽게 받아들여지지 않기도 했다고 한다.\n" +
    "그렇지만 OOP의 뛰어난 효율성으로 자바는 지금과 같이 널리 사용되게 되었다. (물론 효율성 하나만 가지고 널리 사용되게 된건 아니다.)\n" +
    "\n" +
    "잠깐 상식으로 보통 OOP라고 하면 Java를 이야기하기 때문에 OOP하면 Java, Java하면 OOP로 생각을 하고, 자바가 최초의 OOP 언어인걸로 생각하는 사람도 가끔 있는데, 최초로 OOP의 개념을 구현한것은 스몰토크 라는 언어이다.\n" +
    "스몰토크는 정말 100% OOP 언어였는데, 그렇기 때문에 불편한 점도 적지 않았다.\n" +
    "자바에서 변수를 선언할 때, int num, String str; 이런식으로 변수를 선언할 수가 있는데 스몰토크는 무조건 new를 통해서 생성해야 했다고 한다.\n" +
    "\n" +
    "기존과 비교하여 몇가지가 바뀌었다.\n" +
    "먼저 aop라는 태그를 사용하기위해서 7, 11번째줄에 aop 태그를 쓸 수 있도록 선언을 해주었다.\n" +
    "다음으로 13~15번째줄이 바뀌었다. 기존에는 <context:component-scan base-package=\"first></context:component-scan>만 되어 있었는데,\n" +
    "component-scan에 use-default-filters 라는 옵션이 들어가고 <context:include-filter>라는 부분이 추가되었다.\n" +
    "component-scan의 역할은 스프링에서 자동적으로 스테레오 타입의 어노테이션을 등록해주는 역할은 한다.\n" +
    "우리는 @Controller, @Service, @Repository, @Component 라는 어노테이션을 사용했었다.\n" +
    "단순히 이러한 어노테이션을 붙이기만 해도 각각 Controller, Service, DAO의 역할을 할 수 있었던 이유가 component-scan을 통해서 스프링이 자동적으로 bean을 등록시켜줌으로써 그 기능을 했던 것이다.\n" +
    "이것이 우리가 Controller, Service, DAO 또는 FileUtils와 같은 Component를 생성을 하지 않고서도 사용할 수 있었던 이유이다.\n" +
    "만약 component-scan을 하지 않았다면, Controller, Service, DAO를 생성할 때 마다 xml 파일에 작성해야지만 사용할 수 있다. 굉장히 비효율적인 일이 아닐수가 없다.\n" +
    "그런데 여기서 use-default-filters=\"false\"라는 값을 주게되면 이와 같은 어노테이션을 자동으로 검색하지 않겠다는 뜻이 된다.\n" +
    "그리고 <context:include-filter> 태그에 해당하는 어노테이션만 검색하고 bean을 등록시켜 준다. 여기서는 Controller 어노테이션만 검색을 한 것이다.\n" +
    "나머지 @Service, @Repository, @Component 어노테이션은 다른곳에서 component-scan을 하게 할 것이다.\n" +
    "왜 이렇게 설정하는지 의문이 들 것이다.\n" +
    "이는 root context와 servlet context의 차이때문에 그렇다. 이 둘의 차이점은 나중에 설명을 하도록 하겠다.\n" +
    "\n" +
    "마지막으로 30~31번째 줄에 방금 만든 LoggerAspect를 등록하였다.\n" +
    "\n" +
    "이제 AOP의 주요 개념에 대해서 알아보자.\n" +
    "1) 관점(Aspect)\n" +
    "구현하고자 하는 횡단 관심사의 기능을 의미한다. 한개 이상의 포인트컷과 어드바이스의 조합으로 만들어진다.\n" +
    "\n" +
    "2) 조인포인트(Join point)\n" +
    "관점(Aspect)를 삽입하여 어드바이스가 적용될 수 있는 위치를 말한다.\n" +
    "\n" +
    "3) 어드바이스(Advice)\n" +
    "관점(Aspect)의 구현체로 조인 포인트에 삽입되어 동작하는 코드이다.\n" +
    "어드바이스는 조인포인트와 결합하여 동작하는 시점에 따라 5개로 구분된다.\n" +
    "Before Advice : 조인포인트 전에 실행되는 advice\n" +
    "After returning advice : 조인포인트에서 성공적으로 리턴 된 후 실행되는 advice\n" +
    "After throwing advice : 예외가 발생하였을 경우 실행되는 advice\n" +
    "After advice : 조인포인트에서 메서드의 실행결과에 상관없이 무조건 실행되는 advice, 자바의 finally와 비슷한 역할을 한다.\n" +
    "Around advice : 조인포인트의 전 과정(전, 후)에 수행되는 advice\n" +
    "4) 포인트컷(PointCut)\n" +
    "어드바이스를 적용할 조인 포인트를 선별하는 과정이나 그 기능을 정의한 모듈을 의미한다. 패턴매칭을 이용하여 어떤 조인포인트를 사용할 것인지 결정한다.\n" +
    "\n" +
    "5) 타겟(Target)\n" +
    "어드바이스를 받을 대상, 즉 객체를 의미한다. 비지니스로직을 수행하는 클래스일수도 있지만, 프록시 객체(Object)가 될 수도 있다.\n";


 var checkRatio = function (text) {
   var tokens = text.split(' ')
   , numHangeul = 0
   , numEnglish = 0
   , percentage = 0;

   var regExp = {
     hangeul: new RegExp("^[\u1100-\u11FF|\u3130-\u318F|\uA960-\uA97F|\uAC00-\uD7AF|\uD7B0-\uD7FF.,,!?@#\$%\^\&\*\)\(\\-]*$")
   };

   for (var i = 0; i < tokens.length; i++) {
     regExp.hangeul.test(tokens[i]) ? numHangeul++ : numEnglish++;
   }

   console.log("Length: " + tokens.length)
   console.log('-------------------------')

   console.log("# English: " + numEnglish);
   console.log("# Hangeul: " + numHangeul);
   console.log('-------------------------')

   console.log("% English: " + (numEnglish / tokens.length).toFixed(3));
   console.log("% Hangeul: " + (numHangeul / tokens.length).toFixed(3));

 };

checkRatio(testText);
