set nocompatible "非兼容vi模式,避免以前版本的一些bug和局限

"模仿快捷键
source $VIMRUNTIME/vimrc_example.vim
source $VIMRUNTIME/mswin.vim
behave mswin
 "gvim字体设置
set guifont=courier\ New:h12
"set guifont=Consolas:h12
"设置窗体大小
set lines=40 columns=118
"set the position of the window
winpos 150 50
"设置编码
set fenc=utf-8
"gvim内部编码
set encoding=utf-8
"gvim打开支持编码的文件
set fileencodings=ucs-bom,utf-8,cp936,gbk,gb2312
"当前编辑文件的编码(此项决定了被编辑文件的编码!)
"set fileencoding=utf-8
set ignorecase
"解决consle输出乱码,EN:english CN:chinese
language messages zh_CN.utf-8 
"解决菜单乱码
source $VIMRUNTIME/delmenu.vim
source $VIMRUNTIME/menu.vim

set nobackup "关闭自动备份
set noswapfile "关闭交换文件(fuck!,原来可以关闭)
"set number "开启行号标记
"关闭上侧工具栏
set guioptions-=T 
"关闭上侧菜单栏
set guioptions-=m 
set nu
"关闭滚动条
set guioptions-=r
"显示Tab符，使用一高亮竖线代替
"set list                    
"set listchars=tab:\|\ ,
"配色方案
"color morning
color desert
"color koehler
let mapleader=","
"去掉^M
map <Leader>m :%s/^M//g<CR>
map <Leader>js :call g:Jsbeautify()<CR>
"nmap <silent> <F3> :call g:Jsbeautify()<CR>
set tabstop=4 
set softtabstop=4 
set shiftwidth=4 
set noexpandtab 
set autoindent
"高亮当前行
"set cul
"复制当前文件路径
map <Leader>nn :let @+=expand('%:p')<CR>
map <Leader>q :qall!<CR>
"au BufNewFile,BufRead *.less set filetype=less
"Fast editing of .vimrc
map <silent> <leader>ee :e ~/.vimrc<cr>
"When .vimrc is edited, reload it
"autocmd! bufwritepost .vimrc source ~/.vimrc 
"在session option中去掉curdir
"set sessionoptions-=curdir
"在session option中加入sesdir
"set sessionoptions+=sesdir        
if filereadable("Session.vim")
silent source Session.vim
endif

"vundle配置
filetype off
" 此处规定Vundle的路径
set rtp+=$VIM/vimfiles/bundle/vundle/
call vundle#rc('$VIM/vimfiles/bundle/')

Bundle 'gmarik/vundle'

"Bundle 'tpope/vim-fugitive'
"Bundle 'Lokaltog/vim-easymotion'
"Bundle 'rstacruz/sparkup', {'rtp': 'vim/'}
"Bundle 'tpope/vim-rails.git'
"Bundle 'scrooloose/nerdtree'
Bundle 'kien/ctrlp.vim'
"Bundle 'msanders/snipmate.vim'
"Bundle 'mileszs/ack.vim'
Bundle 'Shougo/neocomplete.vim'	
"Bundle 'Valloric/YouCompleteMe'
"Bundle 'Shougo/neocomplcache.vim'
"Bundle 'Townk/vim-autoclose'
"Bundle 'Lokaltog/vim-easymotion'
"Bundle 'Lokaltog/vim-powerline'
Bundle 'bling/vim-airline'
"Bundle 'pangloss/vim-javascript'
"Bundle 'KohPoll/vim-less'
"Bundle 'nono/jquery.vim'
"Bundle 'terryma/vim-multiple-cursors'
"Bundle 'dkprice/vim-easygrep'
"Bundle 'gorodinskiy/vim-coloresque'
Bundle 'mattn/emmet-vim'
"Bundle 'dyng/ctrlsf.vim'
filetype plugin indent on
" 打开语法高亮
syntax enable                
syntax on
"vue文件类型高亮
au BufNewFile,BufRead *.vue set filetype=html

"自动补全<>
":inoremap < <><ESC>ha

 "tags setting
let Tlist_Ctags_Cmd = $VIM.'/vim74/ctags.exe'
let Tlist_Show_One_File=1
let Tlist_Exit_OnlyWindow=1
let Tlist_File_Fold_Auto_Close=1
"把taglist窗口放在屏幕的右侧，缺省在左侧 
let Tlist_Use_Right_Window=1 
let Tlist_Show_Menu=0 "显示taglist菜单
let Tlist_Auto_Open=0 "自动打开taglist

"winmanager setting
let g:winManagerWindowLayout='NERDTree'
"let g:winManagerWindowLayout='NERDTree|TagList,BufExplorer'
"定义打开关闭winmanager按键
nmap <silent> <F2> :WMToggle<cr>
let g:winManagerWidth = 30

"在进入vim时自动打开winmanager
let g:AutoOpenWinManager = 0

"let NERDTreeIgnore += ['\(\.txt\)\@<!$[[file]]'] "error
" '^\.'表示所有以.开头的文件 '.*\.o$'表示以为.o结尾的
let g:NERDTreeIgnore = ['^node_modules$','^\.git$', '.*\.gz$', '^tags$', '*.out$', '\~$']

"set clipboard=unnamed

"airline设置
set laststatus=2
" 开启tabline
let g:airline#extensions#tabline#enabled = 0
let g:airline#extensions#whitespace#enabled = 0
" tabline中当前buffer两端的分隔字符
let g:airline#extensions#tabline#left_sep = ' '
" tabline中未激活buffer两端的分隔字符
let g:airline#extensions#tabline#left_alt_sep = '|'
" tabline中buffer显示编号
let g:airline#extensions#tabline#buffer_nr_show = 0

"vim-javascript
"let b:javascript_fold=1
"let javascript_enable_domhtmlcss=1
"ctlp的配置
"set wildignore+=*/tmp/*,*.so,*.swp,*.zip     " MacOSX/Linux
set wildignore+=*\\tmp\\*,*\\node_modules\\*,*.swp,*.zip,*.exe  " Windows

"let g:ctrlp_custom_ignore = '\v[\/]\.(git|hg|svn)$'
let g:ctrlp_map = '<c-p>'
let g:ctrlp_custom_ignore = {
  \ 'dir':  '\v[\/](\.(git|hg|svn)|node_modules)$',
  \ 'file': '\v\.(exe|so|dll)$'
  \ }

"neocomplete配置

" Disable AutoComplPop.
let g:acp_enableAtStartup = 0
" Use neocomplete.
let g:neocomplete#enable_at_startup = 1
" Use smartcase.
let g:neocomplete#enable_smart_case = 1
" Set minimum syntax keyword length.
let g:neocomplete#sources#syntax#min_keyword_length = 3
let g:neocomplete#lock_buffer_name_pattern = '\*ku\*'

" Close popup by <Space>.
inoremap <expr><Space> pumvisible() ? neocomplete#close_popup() : "\<Space>"

" For cursor moving in insert mode(Not recommended)
"inoremap <expr><Left>  neocomplete#close_popup() . "\<Left>"
"inoremap <expr><Right> neocomplete#close_popup() . "\<Right>"
"inoremap <expr><Up>    neocomplete#close_popup() . "\<Up>"
"inoremap <expr><Down>  neocomplete#close_popup() . "\<Down>"
" Or set this.
"let g:neocomplete#enable_cursor_hold_i = 1
" Or set this.
"let g:neocomplete#enable_insert_char_pre = 1

" AutoComplPop like behavior.
"let g:neocomplete#enable_auto_select = 1

" Shell like behavior(not recommended).
"set completeopt+=longest
"let g:neocomplete#enable_auto_select = 1
"let g:neocomplete#disable_auto_complete = 1
"inoremap <expr><TAB>  pumvisible() ? "\<Down>" : "\<C-x>\<C-u>"

" Enable omni completion.
autocmd FileType css setlocal omnifunc=csscomplete#CompleteCSS
autocmd FileType html,markdown setlocal omnifunc=htmlcomplete#CompleteTags
autocmd FileType javascript setlocal omnifunc=javascriptcomplete#CompleteJS
"autocmd FileType python setlocal omnifunc=pythoncomplete#Complete
autocmd FileType xml setlocal omnifunc=xmlcomplete#CompleteTags

" Enable heavy omni completion.
if !exists('g:neocomplete#sources#omni#input_patterns')
  let g:neocomplete#sources#omni#input_patterns = {}
endif
let g:neocomplete#sources#omni#input_patterns.php = '[^. \t]->\h\w*\|\h\w*::'
let g:neocomplete#sources#omni#input_patterns.c = '[^.[:digit:] *\t]\%(\.\|->\)'
let g:neocomplete#sources#omni#input_patterns.cpp = '[^.[:digit:] *\t]\%(\.\|->\)\|\h\w*::'

" For perlomni.vim setting.
" https://github.com/c9s/perlomni.vim
"let g:neocomplete#sources#omni#input_patterns.perl = '\h\w*->\h\w*\|\h\w*::'


" 在浏览器预览 for win
function! ViewInBrowser(name)
    let file = expand("%:p")
    exec ":update " . file
    let l:browsers = {
        \"cr":"C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
        \"lt":"C:/Program Files/Light/Light.exe",
        \"ie":"C:/Program Files/Internet Explorer/iexplore.exe"
    \}
    let htdocs='D:\\amp\\nginx-1.8.0\\html\\'
    let strpos = stridx(file, substitute(htdocs, '\\\\', '\', "g"))
    if strpos == -1
       exec ":silent !start ". l:browsers[a:name] ." file://" . file
    else
        let file=substitute(file, htdocs, "http://localhost/", "g")
        let file=substitute(file, '\\', '/', "g")
        exec ":!start ". l:browsers[a:name] file   
        "exec ":silent !start ". l:browsers[a:name] file
    endif
endfunction
map <Leader>cr :call ViewInBrowser("cr")<cr>
map <Leader>lt :call ViewInBrowser("lt")<cr>
map <Leader>ie :call ViewInBrowser("ie")<cr>

set diffexpr=MyDiff()
function MyDiff()
  let opt = '-a --binary '
  if &diffopt =~ 'icase' | let opt = opt . '-i ' | endif
  if &diffopt =~ 'iwhite' | let opt = opt . '-b ' | endif
  let arg1 = v:fname_in
  if arg1 =~ ' ' | let arg1 = '"' . arg1 . '"' | endif
  let arg2 = v:fname_new
  if arg2 =~ ' ' | let arg2 = '"' . arg2 . '"' | endif
  let arg3 = v:fname_out
  if arg3 =~ ' ' | let arg3 = '"' . arg3 . '"' | endif
  let eq = ''
  if $VIMRUNTIME =~ ' '
    if &sh =~ '\<cmd'
      let cmd = '""' . $VIMRUNTIME . '\diff"'
      let eq = '"'
    else
      let cmd = substitute($VIMRUNTIME, ' ', '" ', '') . '\diff"'
    endif
  else
    let cmd = $VIMRUNTIME . '\diff'
  endif
  silent execute '!' . cmd . ' ' . opt . arg1 . ' ' . arg2 . ' > ' . arg3 . eq
endfunction
"alt键加num,切换tab
function! TabPos_ActivateBuffer(num)
    let s:count = a:num
    exe "tabfirst"
    exe "tabnext" s:count
endfunction
       
function! TabPos_Initialize()  
for i in range(1, 9)
        exe "map <M-" . i . "> :call TabPos_ActivateBuffer(" . i . ")<CR>"
    endfor
    exe "map <M-0> :call TabPos_ActivateBuffer(10)<CR>"
endfunction
 
"autocmd VimEnter * call TabPos_Initialize()
