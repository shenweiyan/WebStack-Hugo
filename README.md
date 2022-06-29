# 一个基于 Hugo 的静态响应式网址导航主题 

本项目是基于**纯静态**的网址导航网站 [webstack.cc](https://github.com/WebStackPage/WebStackPage.github.io) 制作的 [Hugo](https://gohugo.io/) 主题，是一个基于 Hugo 的静态响应式网址导航主题，其中部分代码参考了以下几个开源项目：<br/>

- [WebStackPage/WebStackPage.github.io](https://github.com/WebStackPage/WebStackPage.github.io)
- [liutongxu/liutongxu.github.io](https://github.com/liutongxu/liutongxu.github.io)
- [iplaycode/webstack-hugo](https://github.com/iplaycode/webstack-hugo)

## 主题开源地址

- GitHub：[https://github.com/shenweiyan/WebStack-Hugo](https://github.com/shenweiyan/WebStack-Hugo)
- Gitee：[https://gitee.com/shenweiyan/WebStack-Hugo](https://gitee.com/shenweiyan/WebStack-Hugo)

## 主题演示地址

- [https://nav.bioitee.com](https://nav.bioitee.com)
- [https://hao.bioitee.com](https://hao.bioitee.com)

## 特色功能

这是 Hugo 版 WebStack 主题。可以借助 Github Pages 或者 Coding 直接托管部署，无需服务器。

总体说一下特点：

- 采用了一直以来最喜欢的 hugo 部署方式，方便高效。
- 主要的配置信息都集成到了 config.toml，一键完成各种自定义的配置。
- 导航的各个信息都集成在 data/webstack.yml 文件中，方便后续增删改动。
```
- taxonomy: 科研办公
  icon: fas fa-flask fa-lg
  list:
    - term: 生物信息
      links:
        - title: NCBI
          logo: ncbi.jpg
          url: https://www.ncbi.nlm.nih.gov/
          description: National Center for Biotechnology Information.
        - title: Bioconda
          logo: bioconda.jpg
          url: https://anaconda.org/bioconda/
          description: "Bioconda :: Anaconda.org."
    - term: 云服务器
      links:
        - title: 阿里云
          logo: 阿里云.jpg
          url: https://www.aliyun.com/
          description: 上云就上阿里云。
        - title: 腾讯云
          logo: 腾讯云.jpg
          url: https://cloud.tencent.com/
          description: 产业智变，云启未来。
```
- 做了手机电脑自适应以及夜间模式。
- 增加了搜索功能，以及下拉的热词选项（基于百度 API）。
- 增加了一言、和风天气的 API。

## 使用说明

这是一个开源的公益项目，你可以拿来制作自己的网址导航，也可以做与导航无关的网站。

WebStack 有非常多的魔改版本，这是其中一个。如果你对本主题进行了一些个性化调整，欢迎来本项目中 issue 分享一下！


## 安装说明

#### Windows 下安装部署

本安装部署在 Windows 7 x64 上测试没问题，相关操作同样适用于 Windows 10，如有任何问题，欢迎留言或者微信与我联系。

##### 第一，下载 Windows 版本的 hugo
下载链接：[https://github.com/gohugoio/hugo/releases](https://github.com/gohugoio/hugo/releases)，在这里我们下载 [hugo_0.89.4_Windows-64bit.zip](https://github.com/gohugoio/hugo/releases/download/v0.89.4/hugo_0.89.4_Windows-64bit.zip)。
![image](https://user-images.githubusercontent.com/26101369/176334175-e5332c6d-7c12-43e2-990d-f0b2770e87d2.png)

##### 第二，解压
我们把 [hugo_0.89.4_Windows-64bit.zip](https://github.com/gohugoio/hugo/releases/download/v0.89.4/hugo_0.89.4_Windows-64bit.zip) 下载到 F:\WebStack 目录下，然后解压到当前文件夹。
![解压完成后，在该目录会多出 hugo.exe、LICENSE、README.md 三个文件](https://user-images.githubusercontent.com/26101369/176334230-085e5e7d-e5cb-4faa-92fd-89dfc9f44379.png)

##### 第三，看 hugo 安装是否安装成功

*Windows 命令行补全快捷提示：*
- *Windows 命令运行窗口中可以使用 Tab 进行命令行补全，例如你当前目录下有一个 WebStack-Hugo 目录，你在命令行窗口中输入一个 w 后按下 Tab 键，命令行就会自动出现 WebStack-Hugo！*
- *使用命令行补全，可以减少代码（或者文件名）的输入，方便快捷，又能减少错误！*

首先，在 Windows 中使用 Win+R 打开“**运行**”对话框，在对话框中输入“**cmd**”，点击确认。
![image](https://user-images.githubusercontent.com/26101369/176334812-b5065ec6-9f34-435b-9f1b-e287b9858eed.png)

其次，在 Windows 运行窗口，先切换盘符到 F 盘，然后进入 hugo 的解压缩目录（F:\WebStack），具体操作如下。

1. 在光标处输入F:，然后按回车；

![image](https://user-images.githubusercontent.com/26101369/176334878-6b6a0450-6b9c-4e07-b9a2-cc7946a99bb7.png)

2. 我们就将盘符切换为 F 盘；

![image](https://user-images.githubusercontent.com/26101369/176334938-04797759-868e-4d4c-83ea-632500c8c043.png)

3. 接着输入 cd WebStack，回车，就进入了 F:\WebStack 目录；使用 ls 可以看到当前目录下的文件。

![image](https://user-images.githubusercontent.com/26101369/176335087-183a144a-9153-4092-a118-69a333a16dd9.png)

4. 最后，输入 hugo.exe version，回车，如图所示，则代表安装成功。

![image](https://user-images.githubusercontent.com/26101369/176335123-b3f00646-b585-4ee7-b6b7-ae3ad958492e.png)

##### 第四，下载 WebStack-Hugo

浏览器打开 [https://github.com/shenweiyan/WebStack-Hugo](https://github.com/shenweiyan/WebStack-Hugo)，点击 Code 下的 "Download ZIP"，把 WebStack-hugo-main.zip 下载到刚才 hugo 解压缩的目录（F:\WebStack）。

![image](https://user-images.githubusercontent.com/26101369/176335212-8b862f50-26d7-4eee-9de7-9478d249d0c2.png)

![image](https://user-images.githubusercontent.com/26101369/176335232-ddd8634f-2bc5-4370-96cb-67be4143e3b7.png)

##### 第五，解压，重命名

把 WebStack-Hugo-main.zip 解压到当前目录。

![image](https://user-images.githubusercontent.com/26101369/176335276-ffb564bb-4260-41fe-a5ca-db5962a149b7.png)

![image](https://user-images.githubusercontent.com/26101369/176335290-95d08d4e-9e96-4db4-a8be-4f6cbc1b5b4a.png)

##### 第六，安装主题

首先，进入 F:\WebStack 目录；

然后，创建一个 themes 的文件夹；

![image](https://user-images.githubusercontent.com/26101369/176335360-87bbd028-4ab7-4f3c-93a8-4d05549f3ff5.png)

接着，把解压后的 WebStack-Hugo 整个文件夹移动到 themes 中。

![image](https://user-images.githubusercontent.com/26101369/176335402-963246c5-c0d1-4073-b645-022df78b724b.png)

第四，将 themes/WebStack-Hugo/exampleSite 目录下的所有文件复制到 hugo 站点根目录（即 F:\WebStack）。

![image](https://user-images.githubusercontent.com/26101369/176335444-1574a2ca-d7ec-489d-90b9-8485d927171a.png)

##### 第七，生成与预览站点

在刚才已经打开的 Windows 命令运行窗口中，**使用下面的命令执行 hugo server，启动站点。**

```shell
hugo.exe server 
```

![image](https://user-images.githubusercontent.com/26101369/176335498-48293871-c621-4f52-a18f-80792b090d29.png)

最后，在浏览器中打开 [http://127.0.0.1:1313/](http://127.0.0.1:1313/)，即可看到生成的站点。

![image](https://user-images.githubusercontent.com/26101369/176335540-650e1fb1-f211-4f70-a3db-42efdd8345ac.png)

#### Linux 下安装部署

安装完本 WebStack-Hugo 主题后，将 exampleSite 目录下的文件复制到 hugo 站点根目录，根据需要把 config.toml 的一些信息改成自己的，导航的网址信息可通过 data 目录下 webstack.yml 修改。

具体执行步骤如下：
```shell
$ mkdir /home/shenweiyan/mysite 
$ cd /home/shenweiyan/mysite

# 安装 WebStack-Hugo 主题
$ mkdir themes
$ cd themes
$ git clone https://github.com/shenweiyan/WebStack-Hugo.git

# 将 exampleSite 目录下的文件复制到 hugo 站点根目录
$ cd /home/shenweiyan/mysite
$ cp -r themes/WebStack-Hugo/exampleSite/* ./

# 启动 hugo 站点
$ hugo server 
# 如果你知道你的公网 ip, 如下面的 132.76.230.31, 可以使用下面的方式执行 hugo server
$ hugo server --baseUrl=132.76.230.31 --bind=0.0.0.0 
```

更多 Windows/Linux 下详细的安装与使用说明，请参考文档：《[WebStack-Hugo | 一个简洁的静态导航主题](https://www.yuque.com/shenweiyan/cookbook/webstack-hugo) - [语雀](https://www.yuque.com/shenweiyan)》。


## 贡献者

感谢以下所有朋友对本主题所做出的贡献，特此致谢。

[@yanbeiyinhanghang](https://github.com/yinhanghang)
