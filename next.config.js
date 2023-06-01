const cors = require('cors');
const nextConfig = {
	middleware: [
    		cors({
      			origin: "*",
    		}),
  	],
       /* async rewrites() { 
		return [ 
			{ 
				source: '/progress/:id', 
				destination: 'https://dev.realdevsquad.com/progress/:id',
			}
                        //'Access-Control-Allow-Origin': 'dev.realdevsquad.com',
                ]
        }, */
	async headers() { 
		return [ 
			{ 
				source: '/', 
				headers: [
					{ 
						key: 'Access-Control-Allow-Origin', 
						value: '*' //'*'
					}
				]	
			},
			{ 
				source: '/(.*)', 
				headers: [
					{ 
						key: 'Access-Control-Allow-Origin', 
						value: '*' //'*'
					}
				]	
			}, 
			{ 
				source: '/progress/:id', 
				headers: [
					{ 
						key: 'Access-Control-Allow-Origin', 
						value: '*' //'*' 
					}
				]
			},
			{ 
				source: '/tasks/:id', 
				headers: [
					{ 
						key: 'Access-Control-Allow-Origin', 
						value: '*' 
					}
				] 
			},
			{ 
				source: '/tasks/:id/details', 
				headers: [
					{ 
						key: 'Access-Control-Allow-Origin', 
						value: '*' 
					}
				] 
			},
		]
	},
	images: {
		domains: ['raw.githubusercontent.com', 'res.cloudinary.com'],
	},
};

module.exports = nextConfig;
