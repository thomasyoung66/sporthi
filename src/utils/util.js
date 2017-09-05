function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function alert(str)
{
  wx.showModal({
    title: '弹窗标题',
    content: str,
    confirmText: "主操作",
 //   cancelText: "辅助操作",
    success: function (res) {
      console.log(res);
      if (res.confirm) {
        console.log('用户点击主操作')
      } else {
        console.log('用户点击辅助操作')
      }
    }
  });
}
function test(){
  return "i come from utils modules!";
}
function dump_obj(obj){
  for(var o in obj){
    console.log(o+":"+obj[o]);
  }
}
function toast(t)
{
  wx.showToast({
    title: t,
  });
}
function getTimeDiff()
{
  var d = new Date().getTime() - new Date("2000/01/01 00:00:00").getTime();
  return Math.floor(d/1000);
}

module.exports = {
  formatTime: formatTime,
  test:test,
  alert:alert,
  dump_obj:dump_obj,
  toast: toast
}
