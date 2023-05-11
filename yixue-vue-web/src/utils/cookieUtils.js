/**
 * CookieUtil常用的一些工具类
 */

export function setCookie(name, value, days) {

  const date = new Date();
  date.setDate(date.getDate()+days);
  document.cookie=name+'='+value+';expires='+date;

  // var domain, domainParts, date, expires, host;
  //
  // if (days)
  // {
  //   date = new Date();
  //   date.setTime(date.getTime()+(days*24*60*60*1000));
  //   expires = "; expires="+date.toGMTString();
  // }
  // else
  // {
  //   expires = "";
  // }
  //
  // host = location.host;
  // if (host.split('.').length === 1)
  // {
  //   // no "." in a domain - it's localhost or something similar
  //   document.cookie = name+"="+value+expires+"; path=/";
  // }
  // else
  // {
  //   // Remember the cookie on all subdomains.
  //   //
  //   // Start with trying to set cookie to the top domain.
  //   // (example: if user is on foo.com, try to set
  //   //  cookie to domain ".com")
  //   //
  //   // If the cookie will not be set, it means ".com"
  //   // is a top level domain and we need to
  //   // set the cookie to ".foo.com"
  //
  //   domainParts = host.split('.');
  //   domainParts.shift();
  //   domain = '.'+domainParts.join('.');
  //
  //   document.cookie = name+"="+value+expires+"; path=/; domain="+domain;
  //
  //   // check if cookie was successfuly set to the given domain
  //   // (otherwise it was a Top-Level Domain)
  //   if (getCookie(name) == null || getCookie(name) != value)
  //   {
  //     // append "." to current domain
  //     domain = '.'+host;
  //     document.cookie = name+"="+value+expires+"; path=/; domain="+domain;
  //   }
  // }
}

export function getCookie(cname) {
  const name = cname + "=";
  const ca = document.cookie.split(';');
  for(let i=0; i<ca.length; i++)
  {
    const c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return null;
}

export function delCookie(name) {
  const exp = new Date();
  exp.setTime(exp.getTime() - 1);
  const cval = getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
