import os
import pytest

from seahub.test_utils import BaseTestCase

TRAVIS = 'TRAVIS' in os.environ


class WeixinWorkCBTest(BaseTestCase):
    @pytest.mark.skipif(TRAVIS, reason="This test can only be run in local.")
    def test_get(self, ):
        resp = self.client.get('/weixin-work/callback/?msg_signature=61a7d120857cdb70d8b936ec5b6e8ed172a41926&timestamp=1543304575&nonce=1542460575&echostr=9uB%2FReg5PQk%2FjzejPjhjWmvKXuxh0R4VK7BJRP62lfRj5kZhuAu0mLMM7hnREJQTJxWWw3Y1BB%2F%2FLkE3V88auA%3D%3D')
        assert resp.content == '6819653789729882111'
