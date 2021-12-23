// 引入mockjs
const Mock = require('mockjs')
// 获取 mock.Random 对象
// 参考：https://github.com/nuysoft/Mock/wiki/Mock.Random
const Random = Mock.Random
let Result = {
    code: 200,
    msg: '操作成功',
    data: null
}
/**
 * Mock.mock( url, post/get , function(options))；
 * url 表示需要拦截的 URL，
 * post/get 需要拦截的 Ajax 请求类型
 *
 * 用于生成响应数据的函数
 */
// 获取验证码图片base64编码以及一个随机码
Mock.mock('/captcha', 'get', () => {
    Result.data = {
        token: Random.string(32), // 获取一个32位的随机字符串,
        captchaImg: Random.dataImage( "120x40", "11111" ) //生成验证码为11111的base64图片编码
    }
    return Result
}),
// 因为mock不认识/login?username=xxx，所以用了正则表达式
Mock.mock(RegExp('/login'), 'post', (config) => {
    // 这里无法在header添加authorization，直接跳过
    console.log("mock----------------login")
    return Result
})
// 因为mock不认识/login?username=xxx，所以用了正则表达式
Mock.mock(RegExp('/user/userInfo'), 'get', (config) => {
    // 这里无法在header添加authorization，直接跳过
    Result.data={
        id:1,
        username:"test",
        avatar:'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    }
    return Result
})
Mock.mock('/menu/nav', 'get', () => {
    // 菜单json
    let nav = [
        {
            name: 'SysManga',
            title: '系统管理',
            icon: 'el-icon-s-operation',
            path: '',
            component: '',
            children: [
                {
                    name: 'SysUser',
                    title: '用户管理',
                    icon: 'el-icon-s-custom',
                    path: '/user/users',
                    component: "user/User",
                    children: []
                },
                {
                    name: 'SysRole',
                    title: '角色管理',
                    icon: 'el-icon-rank',
                    path: '/role/roles',
                    component: "role/Role",
                    children: []
                },
                {
                    name: 'SysMenu',
                    title: '菜单管理',
                    icon: 'el-icon-menu',
                    path: '/menu/menus',
                    component: "menu/Menu",
                    children: []
                }
            ]
        },
        {
            name: 'SysTools',
            title: '系统工具',
            icon: 'el-icon-s-tools',
            path: '',
            children: [
                {
                    name: 'SysDict',
                    title: '数字字典',
                    icon: 'el-icon-s-order',
                    path: '/dict/dicts',
                    component: "dict/Dict",
                    children: []
                },
            ]
        }
    ]
    // 权限数据
    let authoritys = ['SysUser', "SysUser:save"]

    Result.data = {}
    Result.data.nav = nav
    Result.data.authoritys = authoritys
    return Result
})