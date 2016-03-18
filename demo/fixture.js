/*eslint quotes: [0], comma-style: [0]*/

import getHappyLittlePhrase from 'bob-ross-lipsum'

let tweet = {
  'id': 'uuid-tweet',
  'item': '926db660-ed6c-43f6-b838-56ac6a527034',
  'type': 'quote',
  'html': `<blockquote>${getHappyLittlePhrase()}</blockquote>`,
  'score': 0,
  'created_at': '2015-02-23T21:10:10.383Z',
  'updated_at': null,
  'metadata': {
    'starred': false,
    'author': [{
      'name': 'jasonfried',
      'url': 'http://twitter.com/jasonfried',
      'avatar': {
        'src': 'https://pbs.twimg.com/profile_images/3413742921/0e9ef95e76c4a965b9b177fa2267d6c1_bigger.png',
        'width': 73,
        'height': 73,
        'colors': [
          [146, 5, 203],
          [240, 243, 244],
          [17, 17, 20],
          [103, 117, 134],
          [186, 188, 191]
        ]
      }
    }],
    'related': [],
    'publisher': {
      'url': 'http://twitter.com',
      'name': 'Twitter',
      'favicon': 'https://abs.twimg.com/favicons/favicon.ico',
      'domain': 'twitter.com'
    },
    'keywords': ['jasonfried', 'thegridio', 'https', 'thegrid', 'dracula_x', 'conceptually', 'location', 'websites', 'sure', 'waynepelletier'],
    'description': 'https://thegrid.io - "AI" website design. Conceptually feels very next level, an obvious, natural progression just waiting to happen.',
    'inLanguage': 'English',
    '@type': 'Comment',
    'app_links': [],
    '@context': 'http://schema.org',
    'isBasedOnUrl': 'https://twitter.com/jasonfried/status/522492212144525312',
    'source': '926db660-ed6c-43f6-b838-56ac6a527034'
  }
}

let imageRaphael = {
  'id': '50ba0e9b-442d-48bc-a138-d0c25c6c2a3e',
  'item': 'd6fddcde-0831-4058-83a8-110b03aab390',
  'type': 'image',
  'html': '<img alt="StyleNet &num;NeuralArt&comma; inspiration from &commat;jeratt and style by Raphael&period;" src="https://pbs.twimg.com/media/CODJ8KXWoAAVGTP.jpg:large">',
  'score': 0,
  'created_at': '2015-09-05T14:51:49.140Z',
  'updated_at': null,
  'metadata': {
    'author': [
      {
        'name': 'deepforger',
        'url': 'http://twitter.com/deepforger',
        'avatar': {
          'src': 'https://pbs.twimg.com/profile_images/674936695830282240/np255F6b_400x400.jpg',
          'width': 400,
          'height': 400,
          'colors': [
            [
              229,
              212,
              218
            ],
            [
              185,
              162,
              160
            ],
            [
              81,
              70,
              64
            ],
            [
              139,
              118,
              116
            ]
          ]
        }
      }
    ],
    'related': [],
    'publisher': {
      'url': 'http://twitter.com',
      'name': 'Twitter',
      'favicon': 'https://abs.twimg.com/favicons/favicon.ico',
      'domain': 'twitter.com'
    },
    'keywords': [
      'raphael',
      'jeratt',
      'twitter',
      'pic',
      'location',
      'tweet',
      'approx',
      'deepforgery',
      '360k',
      'erbwqjyelg'
    ],
    'description': 'StyleNet #NeuralArt, inspiration from @jeratt and style by Raphael.',
    'inLanguage': 'en',
    '@type': 'Photograph',
    'app_links': [],
    '@context': 'http://schema.org',
    'isBasedOnUrl': 'https://twitter.com/DeepForger/status/639733185505591296',
    'datePublished': null,
    'starred': true,
    'caption': 'StyleNet #NeuralArt, inspiration from @jeratt and style by Raphael.',
    'source': 'd6fddcde-0831-4058-83a8-110b03aab390'
  },
  'caption': 'StyleNet #NeuralArt, inspiration from @jeratt and style by Raphael.',
  'cover': {
    'src': 'https://pbs.twimg.com/media/CODJ8KXWoAAVGTP.jpg:large'
  }
}

let videoTurtle = {
  'id': '89b7bdf8-9143-438a-a5c0-1bfce0726996',
  'item': '77d2788d-d7c5-4fbe-9087-4328d9f12ddb',
  'type': 'video',
  'html': '<iframe src="https://cdn.embedly.com/widgets/media.html?src=http%3A%2F%2Fwww.youtube.com%2Fembed%2FIMShMTn8yEU%3Ffeature%3Doembed&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DIMShMTn8yEU&image=http%3A%2F%2Fi.ytimg.com%2Fvi%2FIMShMTn8yEU%2Fhqdefault.jpg&key=b7d04c9b404c499eba89ee7072e1c4f7&type=text%2Fhtml&schema=youtube" width="640" height="480" scrolling="no" frameborder="0" allowfullscreen="allowfullscreen"></iframe>',
  'score': 0,
  'created_at': '2015-01-28T04:49:07.811Z',
  'updated_at': null,
  'metadata': {
    'author': [
      {
        'name': 'Jon Nordby',
        'url': 'http://www.youtube.com/channel/UCB9kP5NQGu0JLWa9UlkxklQ',
        'avatar': {}
      }
    ],
    'related': [],
    'publisher': {
      'url': 'http://www.youtube.com/',
      'name': 'YouTube',
      'favicon': 'https://s.ytimg.com/yts/img/favicon-vfldLzJxy.ico',
      'domain': 'www.youtube.com'
    },
    'keywords': [
      'duration',
      'nordby',
      'views',
      'flowhub',
      'dyvik',
      'jon',
      'ravensbourne',
      'mozfest',
      'milling',
      'jens'
    ],
    'description': getHappyLittlePhrase(),
    'inLanguage': 'English',
    '@type': 'VideoObject',
    'app_links': [
      {
        'url': 'vnd.youtube://www.youtube.com/watch?v=IMShMTn8yEU&feature=applinks',
        'type': 'ios',
        'app_store_id': '544007664',
        'app_name': 'YouTube'
      },
      {
        'url': 'http://www.youtube.com/watch?v=IMShMTn8yEU&feature=applinks',
        'type': 'android',
        'app_name': 'YouTube',
        'package': 'com.google.android.youtube'
      },
      {
        'url': 'http://www.youtube.com/watch?v=IMShMTn8yEU&feature=applinks',
        'type': 'web'
      }
    ],
    '@context': 'http://schema.org',
    'isBasedOnUrl': 'https://www.youtube.com/watch?v=IMShMTn8yEU',
    'title': getHappyLittlePhrase(),
    'starred': false,
    'source': '77d2788d-d7c5-4fbe-9087-4328d9f12ddb'
  },
  'video': {
    'src': 'https://cdn.embedly.com/widgets/media.html?src=http%3A%2F%2Fwww.youtube.com%2Fembed%2FIMShMTn8yEU%3Ffeature%3Doembed&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DIMShMTn8yEU&image=http%3A%2F%2Fi.ytimg.com%2Fvi%2FIMShMTn8yEU%2Fhqdefault.jpg&key=b7d04c9b404c499eba89ee7072e1c4f7&type=text%2Fhtml&schema=youtube'
  },
  'cover': {
    'orientation': 'landscape',
    'src': 'http://i.ytimg.com/vi/IMShMTn8yEU/hqdefault.jpg',
    'ratio': '4:3',
    'width': 480,
    'height': 360,
    'faces': [],
    'colors': [[47, 47, 48], [213, 215, 206], [123, 119, 115], [149, 162, 164], [136, 144, 159]]
  },
  'title': 'Mozfest 2014 - Turtle Power: Mirobot and Flowhub penplotting'
}

let article = {
  'id': '272572a7-14f8-444c-864e-3284ddb7c025',
  'item': 'ad25432f-11f9-4326-8b0c-edbffa7afbdc',
  'type': 'article',
  'html': "<article><h1>Turtle power to the people</h1><p>14 Jan 2015 by Vilson Vieira After working for about three years with Forrest we finally meet him on a meet up of The Grid team. During the first days we were preparing a workshop for MozFest's #ArtOfWeb track. The idea was to present a quick introduction to Flowhub/ NoFlo and how to use it to draw with Mirobot.</p><img src=\"http://i.imgur.com/F7C5adG.png\"></article>",
  'score': 0,
  'created_at': '2015-01-28T04:48:17.057Z',
  'updated_at': null,
  'metadata': {
    'related': [
      {
        'score': 0.5406122803688049,
        'description': 'Courtesy of the Garage Museum of Contemporary Art Courtesy of the Garage Museum of Contemporary Art Courtesy of the Garage Museum of Contemporary Art Courtesy of the Garage Museum of Contemporary Art Russian media artist Dmitry Morozov is something of a robot whisperer.',
        'title': 'An Orchestra of Tiny, Humming Robots That You Conduct With Gestures | WIRED',
        'url': 'http://www.wired.com/2015/01/orchestra-tiny-humming-robots-conduct-gestures/',
        'thumbnail_height': 750,
        'thumbnail_url': 'http://www.wired.com/wp-content/uploads/2015/01/IMG_5196.jpg',
        'thumbnail_width': 1000
      }
    ],
    'publisher': {
      'url': 'http://meemoo.org',
      'name': 'Meemoo',
      'favicon': 'http://meemoo.org/favicon.ico',
      'domain': 'meemoo.org'
    },
    'keywords': [
      'mirobot',
      'draw',
      'mozfest',
      'artofweb',
      'kat',
      'robots',
      'noflo',
      'art',
      'workshops',
      'graph'
    ],
    'description': getHappyLittlePhrase(5),
    'inLanguage': 'English',
    'app_links': [],
    '@context': 'http://schema.org',
    '@type': 'Article',
    'isBasedOnUrl': 'http://meemoo.org/blog/2015-01-14-turtle-power-to-the-people/',
    'title': getHappyLittlePhrase(),
    'starred': false,
    'caption': "14 Jan 2015 by Vilson Vieira After working for about three years with Forrest we finally meet him on a meet up of The Grid team. During the first days we were preparing a workshop for MozFest's #ArtOfWeb track. The idea was to present a quick introduction to Flowhub/ NoFlo and how to use it to draw with Mirobot.",
    'source': 'ad25432f-11f9-4326-8b0c-edbffa7afbdc'
  },
  'cover': {
    'orientation': 'landscape',
    'src': 'http://i.imgur.com/F7C5adG.png',
    'ratio': '1206:511',
    'width': 1206,
    'height': 511,
    'faces': [],
    'colors': [[7, 8, 8], [177, 178, 177], [251, 4, 28], [14, 208, 125], [21, 106, 194]]
  },
  'title': 'Turtle power to the people',
  'caption': "14 Jan 2015 by Vilson Vieira After working for about three years with Forrest we finally meet him on a meet up of The Grid team. During the first days we were preparing a workshop for MozFest's #ArtOfWeb track. The idea was to present a quick introduction to Flowhub/ NoFlo and how to use it to draw with Mirobot."
}

let imageCole = {
  'id': '820d4bb0-6834-410c-8bca-5d9ee0ed0be4',
  'item': '51642a12-50cf-4072-855c-d7d8294ba125',
  'type': 'image',
  'html': '<img src="http://the-grid-user-content.s3-us-west-2.amazonaws.com/b1dd2ebd-7461-4960-a3be-05f22c649a63.jpg">',
  'score': 0,
  'created_at': '2015-02-24T16:09:10.501Z',
  'updated_at': null,
  'metadata': {
    'description': getHappyLittlePhrase(5),
    '@context': 'http://schema.org',
    '@type': 'Article',
    'publisher': {
      'domain': 'the-grid-user-content.s3-us-west-2.amazonaws.com',
      'name': 'The Grid'
    },
    'starred': false,
    'source': '51642a12-50cf-4072-855c-d7d8294ba125',
    author: [{
      name: 'Cole Rise',
      url: 'https://cole.grid/'
    }],
    title: getHappyLittlePhrase(),
    coverPrefs: {
      filter: false
    }
  },
  'cover': {
    'orientation': 'landscape',
    'src': 'http://the-grid-user-content.s3-us-west-2.amazonaws.com/b1dd2ebd-7461-4960-a3be-05f22c649a63.jpg',
    'ratio': '3:2',
    'width': 1500,
    'height': 1000,
    'faces': [],
    'colors': [[82, 69, 86], [213, 167, 183], [122, 144, 192], [159, 178, 204], [148, 109, 113]],
    'saliency': {
      'polygon': [[1219, 259], [1213, 254], [1190, 251], [1178, 264], [1151, 266], [1130, 275], [1113, 293], [1045, 293], [960, 282], [917, 282], [838, 292], [824, 302], [767, 311], [766, 322], [709, 318], [621, 341], [550, 384], [492, 410], [471, 424], [466, 434], [453, 434], [382, 469], [340, 469], [285, 446], [268, 449], [267, 456], [276, 457], [278, 480], [307, 484], [311, 571], [272, 576], [267, 607], [313, 604], [339, 621], [366, 624], [367, 658], [464, 641], [467, 635], [532, 619], [532, 606], [610, 598], [641, 591], [728, 587], [834, 571], [914, 569], [987, 578], [998, 585], [1025, 585], [1027, 591], [1050, 593], [1051, 599], [1083, 599], [1084, 611], [1119, 611], [1127, 624], [1144, 615], [1184, 615], [1192, 636], [1204, 630], [1206, 619], [1215, 614], [1215, 540], [1232, 534], [1232, 527], [1180, 527], [1180, 487], [1199, 469], [1190, 447], [1190, 406], [1197, 405], [1200, 367], [1216, 366], [1208, 341], [1208, 298], [1217, 295], [1223, 282]],
      'center': [743, 433],
      'radius': 522.01,
      'bounding_rect': [[267, 251], [1233, 659]]
    }
  }
}

let code = {
  'id': 'uuid-code',
  'type': 'code',
  'html': '<pre><code class="language-coffeescript">&num; Assignment&colon;&NewLine;number   &equals; 42&NewLine;opposite &equals; true&NewLine;&NewLine;&num; Conditions&colon;&NewLine;number &equals; -42 if opposite&NewLine;&NewLine;&num; Functions&colon;&NewLine;square &equals; &lpar;x&rpar; -&gt; x &midast; x&NewLine;&NewLine;&num; Arrays&colon;&NewLine;list &equals; &lsqb;1&comma; 2&comma; 3&comma; 4&comma; 5&rsqb;&NewLine;&NewLine;&num; Objects&colon;&NewLine;math &equals;&NewLine;  root&colon;   Math&period;sqrt&NewLine;  square&colon; square&NewLine;  cube&colon;   &lpar;x&rpar; -&gt; x &midast; square x&NewLine;&NewLine;&num; Splats&colon;&NewLine;race &equals; &lpar;winner&comma; runners&period;&period;&period;&rpar; -&gt;&NewLine;  print winner&comma; runners&NewLine;&NewLine;&num; Existence&colon;&NewLine;alert &quot;I knew it&excl;&quot; if elvis&quest;&NewLine;&NewLine;&num; Array comprehensions&colon;&NewLine;cubes &equals; &lpar;math&period;cube num for num in list&rpar;</code></pre>',
  'metadata': {
    'title': 'code code',
    'description': 'very sample code',
    'programmingLanguage': 'text/coffeescript'
  },
  'src': null,
  'text': '# Assignment:\nnumber   = 42\nopposite = true\n\n# Conditions:\nnumber = -42 if opposite\n\n# Functions:\nsquare = (x) -> x * x\n\n# Arrays:\nlist = [1, 2, 3, 4, 5]\n\n# Objects:\nmath =\n  root:   Math.sqrt\n  square: square\n  cube:   (x) -> x * square x\n\n# Splats:\nrace = (winner, runners...) ->\n  print winner, runners\n\n# Existence:\nalert "I knew it!" if elvis?\n\n# Array comprehensions:\ncubes = (math.cube num for num in list)',
  'length': 32,
  'measurementVersion': 5
}

let imageBeingD4 = {
  'id': 'a68ed3c5-0f6c-4a9f-80b5-5b77deeceb75',
  'item': 'df7acda0-96f2-4185-995c-ed52f921bc8c',
  'type': 'image',
  'html': '<img src="http://i.meemoo.me/v1/in/Adx3TWdBQ3O3uJvyH2DP_being-d4.jpg">',
  'score': 0,
  'created_at': '2015-04-28T19:35:32.723Z',
  'updated_at': '2015-04-28T20:38:06.067Z',
  'metadata': {
    '@type': 'Article',
    'isBasedOnUrl': 'http://i.meemoo.me/v1/in/Adx3TWdBQ3O3uJvyH2DP_being-d4.jpg',
    'inLanguage': null,
    'starred': true,
    'keywords': [],
    'description': '',
    '@context': 'http://schema.org',
    'source': 'df7acda0-96f2-4185-995c-ed52f921bc8c',
    'title': getHappyLittlePhrase(),
    'author': [
      {
        'name': 'Gordon'
      }
    ],
    'authors': [],
    'publisher': {
      'name': 'i.meemoo.me',
      'domain': 'i.meemoo.me',
      'url': null,
      'favicon': null
    },
    'user': '79922a3a-1dcb-4a43-9b62-e4f3af6ad4ca'
  },
  'title': 'being d4',
  'cover': {
    'colors': [
      [186, 168, 146],
      [144, 126, 104],
      [50, 39, 37],
      [225, 208, 192],
      [108, 90, 68]
    ],
    'saliency': {
      'polygon': [[1350, 300], [600, 200], [100, 250], [200, 600], [1250, 700]],
      'center': [720, 480],
      'radius': 700,
      'bounding_rect': [[100, 200], [1350, 700]]
    },
    'src': 'http://i.meemoo.me/v1/in/Adx3TWdBQ3O3uJvyH2DP_being-d4.jpg',
    'orientation': 'landscape',
    'ratio': '1439:960',
    'aspect': 1.4989583333333334,
    'width': 1439,
    'height': 960,
    'faces': [
      {
        'x': 861.8829719722327,
        'y': 281.48480412110683,
        'width': 60.181420320681795,
        'height': 60.181420320681795,
        'neighbors': 11,
        'confidence': 8.715965329999982
      },
      {
        'x': 367.5215516831421,
        'y': 271.5025992013226,
        'width': 54.27794792754907,
        'height': 54.27794792754907,
        'neighbors': 14,
        'confidence': 8.305308969999993
      },
      {
        'x': 492.2391919725017,
        'y': 269.0176883767215,
        'width': 57.606293506030504,
        'height': 57.606293506030504,
        'neighbors': 12,
        'confidence': 7.161568390000004
      },
      {
        'x': 486.83705737694504,
        'y': 356.029814100986,
        'width': 50.952088047919155,
        'height': 50.952088047919155,
        'neighbors': 12,
        'confidence': 6.479253949999998
      },
      {
        'x': 296.1169884519212,
        'y': 475.6954071226223,
        'width': 67.83546137450323,
        'height': 67.83546137450323,
        'neighbors': 13,
        'confidence': 6.356675570000005
      },
      {
        'x': 646.9246222261988,
        'y': 253.0477345948331,
        'width': 59.64585507428254,
        'height': 59.64585507428254,
        'neighbors': 5,
        'confidence': 6.261280809999998
      },
      {
        'x': 364.884811041297,
        'y': 383.55097623690574,
        'width': 66.86416232804767,
        'height': 66.86416232804767,
        'neighbors': 5,
        'confidence': 5.530725450000008
      },
      {
        'x': 1224.101870760976,
        'y': 376.2916179188117,
        'width': 74.9664382734353,
        'height': 74.9664382734353,
        'neighbors': 5,
        'confidence': 5.0318680700000025
      },
      {
        'x': 958.9959594409227,
        'y': 309.52397139018944,
        'width': 59.64585507428254,
        'height': 59.64585507428254,
        'neighbors': 5,
        'confidence': 4.866107930000008
      },
      {
        'x': 173.1109328273247,
        'y': 294.3856103938531,
        'width': 58.86220762496542,
        'height': 58.86220762496542,
        'neighbors': 9,
        'confidence': 4.741367449999998
      },
      {
        'x': 462.6463818447289,
        'y': 502.5678372367916,
        'width': 61.23303015148604,
        'height': 61.23303015148604,
        'neighbors': 10,
        'confidence': 3.994080369999999
      },
      {
        'x': 992.4931228509183,
        'y': 507.1828350769815,
        'width': 65.59088857569006,
        'height': 65.59088857569006,
        'neighbors': 7,
        'confidence': 3.941819850000007
      },
      {
        'x': 594.709265637875,
        'y': 443.2626331406745,
        'width': 63.90080839651627,
        'height': 63.90080839651627,
        'neighbors': 5,
        'confidence': 1.0505017100000016
      },
      {
        'x': 1049.8796264067955,
        'y': 391.1239187982759,
        'width': 60.997264465222855,
        'height': 60.997264465222855,
        'neighbors': 4,
        'confidence': 0.9801972499999992
      },
      {
        'x': 1034.9838867187502,
        'y': 197.44091796875003,
        'width': 68.15576171875001,
        'height': 68.15576171875001,
        'neighbors': 1,
        'confidence': 0.57032285
      },
      {
        'x': 245.90400995259034,
        'y': 397.7505269498268,
        'width': 40.877432949014576,
        'height': 40.877432949014576,
        'neighbors': 2,
        'confidence': -0.4849196699999989
      },
      {
        'x': 1049.9172332545004,
        'y': 296.3101539291114,
        'width': 61.197989614635624,
        'height': 61.197989614635624,
        'neighbors': 2,
        'confidence': -1.4843781100000037
      },
      {
        'x': 1092.2399786737249,
        'y': 196.29603325403448,
        'width': 76.4162095711182,
        'height': 76.4162095711182,
        'neighbors': 1,
        'confidence': -1.75232689
      },
      {
        'x': 741.3058376715854,
        'y': 335.31251666732015,
        'width': 54.240217510521234,
        'height': 54.240217510521234,
        'neighbors': 1,
        'confidence': -2.690027709999997
      },
      {
        'x': 867.1901815303999,
        'y': 44.424485310163526,
        'width': 48.39919881847384,
        'height': 48.39919881847384,
        'neighbors': 1,
        'confidence': -4.276220189999993
      }
    ]
  }
}

let sharing = {
  id: 'uuid-share-00',
  type: 'placeholder',
  metadata: {
    status: 'Sharing... https://thegrid.io/#8'
  }
}

let post = {
  id: 'post-uuid-01234',
  metadata: {
    title: getHappyLittlePhrase(),
    description: getHappyLittlePhrase(),
    inFeed: true,
    starred: false,
    hasPage: true,
    inNav: false,
    tags: ['tag1', 'tag2']
  },
  published: false,
  content: [
    {
      'id': 'abc-00000000-p',
      'type': 'text',
      'html': `<p>${getHappyLittlePhrase()}<br><strong>Strong.</strong> <em>Em.</em> <strong><em>Both.</em></strong> Plain.</p>`,
      'metadata': {'starred': true}
    },
    imageCole,
    {
      'id': 'abc-00000000-h1',
      'type': 'h1',
      'html': `<h1>${getHappyLittlePhrase()}</h1>`,
      'metadata': {}
    },
    {
      'id': 'abc-00000000-blockquote',
      'type': 'blockquote',
      'html': `<blockquote>${getHappyLittlePhrase()}</blockquote>`,
      'metadata': {}
    },
    code,
    {
      'id': 'abc-00000000-p2',
      'type': 'p',
      'html': `<p>${getHappyLittlePhrase()}</p>`
    },
    {
      'id': 'uuid-broken-00',
      'type': undefined
    },
    imageRaphael,
    videoTurtle,
    {
      'id': 'abc-00000000-h2',
      'type': 'h2',
      'html': `<h2>${getHappyLittlePhrase()}</h2>`
    },
    article,
    tweet,
    sharing,
    {
      'id': 'abc-00000000-h3',
      'type': 'h3',
      'html': `<h3>${getHappyLittlePhrase()}</h3>`
    },
    imageBeingD4,
    {
      'id': 'abc-00000000-02',
      'type': 'text',
      'html': `<p>${getHappyLittlePhrase(2)}</p>`
    },
    {
      'id': 'abc-00000000-03',
      'type': 'quote',
      'html': `<blockquote><p>${getHappyLittlePhrase(3)}</p></blockquote>`
    },
    {
      'id': 'abc-00000000-ol',
      'type': 'list',
      'html': `<ol><li>${getHappyLittlePhrase()}</li><li>${getHappyLittlePhrase()}</li></ol>`
    },
    {
      'id': 'abc-00000000-ul',
      'type': 'list',
      'html': `<ul><li>${getHappyLittlePhrase()}</li><li>${getHappyLittlePhrase()}</li></ul>`
    }
  ]
}


export default post
