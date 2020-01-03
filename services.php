<?php

header('Access-Control-Allow-Origin: *');

$timer = Array(
                'apikey'=> '3c58736c7c8fce605532b6b5399650607fd626396bc3ee0471ed13c65ca1f5ff2cd81c9d5a5426ce9c14ef22ab762d0ec29841d9787a90eb7aa204141f1a1173',
                'id' => 9,
                'timer_code' => '421072afc2e955182b73c6b9c9b99c83a068',
                'set_time'=>  '50:11',
                'status' => 1

);

echo json_encode($timer);
?>