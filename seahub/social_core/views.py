from django.conf import settings
from django.http import HttpResponse

from seahub.social_core.utils.WXBizMsgCrypt import WXBizMsgCrypt

def weixin_work_cb(request):
    """Callback for weixin work provider API.

    https://work.weixin.qq.com/api/doc#90001/90143/91116
    """

    token = settings.SOCIAL_AUTH_WEIXIN_WORK_TOKEN
    EncodingAESKey = settings.SOCIAL_AUTH_WEIXIN_WORK_AES_KEY

    msg_signature = request.GET.get('msg_signature', None)
    timestamp = request.GET.get('timestamp', None)
    nonce = request.GET.get('nonce', None)
    if not (msg_signature and timestamp and nonce):
        assert False, 'Request Error'

    if request.method == 'GET':
        echostr = request.GET.get('echostr', '')
    elif request.method == 'POST':
        assert False

    wxcpt = WXBizMsgCrypt(token, EncodingAESKey, settings.SOCIAL_AUTH_WEIXIN_WORK_KEY)

    ret, decoded_echostr = wxcpt.VerifyURL(msg_signature, timestamp, nonce, echostr)
    if ret != 0:
        assert False, 'Verify Error'

    return HttpResponse(decoded_echostr)
