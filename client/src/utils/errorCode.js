const errorArray = function() {
  var array = new Array();
  array["201"] = "用户名已存在";
  array["202"] = "用户不存在";
  array["203"] = "密码不正确";
  array["203"] = "密码不正确";
  array["204"] = "获取历史记录失败";

  array["400"] = "缺少参数";
  array["600"] = "token过期";

  return array;
};
export default errorArray();
