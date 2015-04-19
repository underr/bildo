# bildo
bildo is the esperanto for image

### Install and update

`npm install -g bildo`. You may need root.

### Usage

For example, let's say we want a quick galery from a directory named **pepper**. 

Run `bildo pepper` and access [localhost:5000](http://localhost:5000). You'll get something like this, with every image that's on that directory:

![bildo](http://a.pomf.se/eptqdf.png)

#### Options:

`bildo <folder> --items [number]` - How many items you want per page (default: 20)

`bildo <folder> --port [port]` -Which port to use (default: 5000)

`bildo <folder> --nogrid` - Don't display images on a grid
