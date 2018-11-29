# encoding: utf-8
import logging

import requests
from django.conf import settings
from django.core.cache import cache
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.views.decorators.csrf import csrf_exempt

from seahub.social_core.utils.WXBizMsgCrypt import WXBizMsgCrypt
from seahub.utils.urls import abs_reverse

# Get an instance of a logger
logger = logging.getLogger(__name__)

@csrf_exempt
def weixin_work_cb(request):
    """Callback for weixin work provider API.

    Used in callback config at app details page.
    e.g. https://open.work.weixin.qq.com/wwopen/developer#/sass/apps/detail/ww24c53566499d354f

    ref: https://work.weixin.qq.com/api/doc#90001/90143/91116
    """

    token = settings.SOCIAL_AUTH_WEIXIN_WORK_TOKEN
    EncodingAESKey = settings.SOCIAL_AUTH_WEIXIN_WORK_AES_KEY

    msg_signature = request.GET.get('msg_signature', None)
    timestamp = request.GET.get('timestamp', None)
    nonce = request.GET.get('nonce', None)
    if not (msg_signature and timestamp and nonce):
        assert False, 'Request Error'

    if request.method == 'GET':
        wxcpt = WXBizMsgCrypt(token, EncodingAESKey,
                              settings.SOCIAL_AUTH_WEIXIN_WORK_KEY)

        echostr = request.GET.get('echostr', '')
        ret, decoded_echostr = wxcpt.VerifyURL(msg_signature, timestamp, nonce, echostr)
        if ret != 0:
            assert False, 'Verify Error'

        return HttpResponse(decoded_echostr)

    elif request.method == 'POST':
        wxcpt = WXBizMsgCrypt(token, EncodingAESKey,
                              settings.SOCIAL_AUTH_WEIXIN_WORK_SUITID)

        ret, xml_msg = wxcpt.DecryptMsg(request.body, msg_signature, timestamp, nonce)
        if ret != 0:
            assert False, 'Decrypt Error'

        import xml.etree.cElementTree as ET
        xml_tree = ET.fromstring(xml_msg)
        suite_ticket = xml_tree.find("SuiteTicket").text
        logger.info('suite ticket: %s' % suite_ticket)

        # TODO: use persistent store
        cache.set('wx_work_suite_ticket', suite_ticket, 3600)

        return HttpResponse('success')

def _get_suite_access_token():
    suite_access_token = cache.get('wx_work_suite_access_token', None)
    if suite_access_token:
        return suite_access_token

    suite_ticket = cache.get('wx_work_suite_ticket', None)
    if not suite_ticket:
        assert False, 'suite ticket is None!'

    get_suite_token_url = 'https://qyapi.weixin.qq.com/cgi-bin/service/get_suite_token'
    resp = requests.request(
        'POST', get_suite_token_url,
        json={
            "suite_id": settings.SOCIAL_AUTH_WEIXIN_WORK_SUITID,
            "suite_secret": settings.SOCIAL_AUTH_WEIXIN_WORK_SUIT_SECRET,
            "suite_ticket": suite_ticket,
        },
        headers={'Content-Type': 'application/json',
                 'Accept': 'application/json'},
    )

    suite_access_token = resp.json().get('suite_access_token', None)
    if not suite_access_token:
        logger.error('Failed to get suite_access_token!')
        logger.error(resp.content)
        assert False, 'suite_access_token is None!'
    else:
        cache.set('wx_work_suite_access_token', suite_access_token, 3600)
        return suite_access_token

def weixin_work_3rd_app_install(request):
    """Redirect user to weixin work 3rd app install page.
    """
    # 0. get suite access token
    suite_access_token = _get_suite_access_token()
    print('suite access token', suite_access_token)

    # 1. get pre_auth_code
    get_pre_auth_code_url = 'https://qyapi.weixin.qq.com/cgi-bin/service/get_pre_auth_code?suite_access_token=' + suite_access_token
    resp = requests.request('GET', get_pre_auth_code_url)

    pre_auth_code = resp.json().get('pre_auth_code', None)
    if not pre_auth_code:
        logger.error('Failed to get pre_auth_code')
        logger.error(resp.content)
        assert False, 'pre_auth_code is None'

    # 2. set session info
    # ref: https://work.weixin.qq.com/api/doc#90001/90143/90602
    url = 'https://qyapi.weixin.qq.com/cgi-bin/service/set_session_info?suite_access_token=' + suite_access_token
    resp = requests.request(
        'POST', url,
        json={
            "pre_auth_code": pre_auth_code,
            "session_info":
            {
                "appid": [],
                "auth_type": 1  # TODO: 0: production; 1: testing.
            }
        },
        headers={'Content-Type': 'application/json',
                 'Accept': 'application/json'},

    )

    # TODO: use random state
    url = 'https://open.work.weixin.qq.com/3rdapp/install?suite_id=%s&pre_auth_code=%s&redirect_uri=%s&state=STATE123' % (
        settings.SOCIAL_AUTH_WEIXIN_WORK_SUITID,
        pre_auth_code,
        abs_reverse('weixin_work_3rd_app_install_cb'),
    )
    return HttpResponseRedirect(url)

def weixin_work_3rd_app_install_cb(request):
    """Callback for weixin work 3rd app install API.

    https://work.weixin.qq.com/api/doc#90001/90143/90597

    e.g. https://dev.seafile.com/seahub/weixin-work/3rd-app-install/callback/?auth_code=7-NV971gJwA95gzezuBl6-QhqRPfpvryTz_XWd5s-8RosAj1wMzkqlC45H1xYhB9ebf42bdKua8Ocj7ckQkMz4fsoucDuwmXtjr-goztCSE&state=STATE123&expires_in=1200
    """
    auth_code = request.GET.get('auth_code', None)
    state = request.GET.get('state', None)  # TODO: check state

    if not (auth_code and state):
        raise Http404

    # 1. get perm code
    suite_access_token = _get_suite_access_token()
    url = 'https://qyapi.weixin.qq.com/cgi-bin/service/get_permanent_code?suite_access_token=' + suite_access_token

    resp = requests.request(
        'POST', url,
        json={
            "auth_code": auth_code
        }
    )

    assert False

a = '''{
"access_token":"UAFEgMW5IazAeldj_AXOWQ-n2hLcCMD9zMjgg5tgIkwQPLw85efBzgZ9fiL1ReK1mdnlIZqcFHKWUbZYtYcEkY-DxrG8lay2bUOH3Fd3La2qYxXZ2V-t3xhQEcUi8d3Bqf67BZCwLK5Rsc-Vk3CX8ouba1A7FDAOV56pvuNTK2MTmvmoSoPcXdRL-orqGl2HiaCMc6KZOScyEbIaOEhMSg","expires_in":7200,

"permanent_code":"5yWUpUc7DV8kcbtn_MCLHMQFjflA5DEFIADR-wbGUMI",

"auth_corp_info":{"corpid":"wwcbae32011b764296","corp_name":"Seafile","corp_type":"verified","corp_round_logo_url":"http://p.qpic.cn/pic_wework/777222225/d4d278dcef2074c0a091de98ad16a352bc736d89785c029d/0","corp_square_logo_url":"https://p.qpic.cn/qqmail_pic/2560554501/3d3b9135a8758668aa65cfd2e821bb2a2eed2a5f98f1681a/0","corp_user_max":200,"corp_agent_max":0,"corp_wxqrcode":"http://p.qpic.cn/pic_wework/777222225/1f19b317c3610bb03d491c2125d718c5526385bdfb4d5dc9/0","corp_full_name":u"北京海文互知网络技术有限公司","subject_type":1,"verified_end_time":1572011699,"corp_scale":"1-50人","corp_industry":u"IT服务","corp_sub_industry":u"计算机软件/硬件/信息服务","location":u"北京市"},

"auth_info":{"agent":[{"agentid":1000014,"name":"Seafile Dev SaaS","square_logo_url":"https://p.qlogo.cn/bizmail/ico25prcEu1EpwN0XF0fOfmx9yFP1caB6FKVMzGWQsOhVcQAaeZSPGA/0","privilege":{"level":1,"allow_party":[13],"allow_user":[],"allow_tag":[],"extra_party":[],"extra_user":[],"extra_tag":[]}}]},

"auth_user_info":{"userid":"ZhengXie","name":u"郑勰","avatar":"https://p.qlogo.cn/bizmail/FYPnuBYjQhcVUlSbo2NI63AasITz26QarTgYLeR5FviagbzcGTWtlOQ/0"}}
'''
